/**
 * Bundle Analyzer Script
 * 
 * تحليل حجم Bundle وتحديد الملفات الكبيرة
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * تحليل ملف dist/index.html
 */
function analyzeBundle() {
  try {
    const distPath = join(__dirname, '../dist')
    const indexPath = join(distPath, 'index.html')
    
    // Check if dist folder exists
    const fs = await import('fs/promises')
    try {
      await fs.access(distPath)
    } catch {
      console.error('❌ dist folder not found. Please run "npm run build" first.')
      process.exit(1)
    }

    // Read index.html
    const indexHtml = readFileSync(indexPath, 'utf-8')
    
    // Extract script and link tags
    const scriptMatches = indexHtml.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)
    const linkMatches = indexHtml.matchAll(/<link[^>]*href="([^"]+)"[^>]*>/g)
    
    const assets = []
    
    // Process scripts
    for (const match of scriptMatches) {
      const src = match[1]
      if (src.startsWith('/')) {
        const filePath = join(distPath, src.substring(1))
        try {
          const stats = await fs.stat(filePath)
          assets.push({
            type: 'script',
            path: src,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          })
        } catch (err) {
          console.warn(`⚠️  Could not read file: ${src}`)
        }
      }
    }
    
    // Process stylesheets
    for (const match of linkMatches) {
      const href = match[1]
      if (href.startsWith('/') && href.endsWith('.css')) {
        const filePath = join(distPath, href.substring(1))
        try {
          const stats = await fs.stat(filePath)
          assets.push({
            type: 'style',
            path: href,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          })
        } catch (err) {
          console.warn(`⚠️  Could not read file: ${href}`)
        }
      }
    }
    
    // Sort by size
    assets.sort((a, b) => b.size - a.size)
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: assets.length,
      totalSize: assets.reduce((sum, asset) => sum + asset.size, 0),
      totalSizeKB: (assets.reduce((sum, asset) => sum + asset.size, 0) / 1024).toFixed(2),
      totalSizeMB: (assets.reduce((sum, asset) => sum + asset.size, 0) / (1024 * 1024)).toFixed(2),
      assets: assets,
      recommendations: generateRecommendations(assets),
    }
    
    // Print report
    console.log('\n📊 Bundle Analysis Report\n')
    console.log(`Total Files: ${report.totalFiles}`)
    console.log(`Total Size: ${report.totalSizeMB} MB (${report.totalSizeKB} KB)\n`)
    console.log('Top 10 Largest Files:\n')
    assets.slice(0, 10).forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.path}`)
      console.log(`   Type: ${asset.type}`)
      console.log(`   Size: ${asset.sizeMB} MB (${asset.sizeKB} KB)\n`)
    })
    
    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:\n')
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}\n`)
      })
    }
    
    // Save report to file
    const reportPath = join(distPath, 'bundle-analysis.json')
    writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n✅ Report saved to: ${reportPath}`)
    
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error)
    process.exit(1)
  }
}

/**
 * Generate recommendations based on bundle analysis
 */
function generateRecommendations(assets) {
  const recommendations = []
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0)
  const totalSizeMB = totalSize / (1024 * 1024)
  
  // Check total bundle size
  if (totalSizeMB > 2) {
    recommendations.push(
      `Bundle size is ${totalSizeMB.toFixed(2)} MB. Consider code splitting to reduce initial load time.`
    )
  }
  
  // Check for large individual files
  const largeFiles = assets.filter(asset => asset.size > 500 * 1024) // > 500KB
  if (largeFiles.length > 0) {
    recommendations.push(
      `Found ${largeFiles.length} file(s) larger than 500KB. Consider lazy loading or splitting these files.`
    )
  }
  
  // Check for too many chunks
  if (assets.length > 20) {
    recommendations.push(
      `Found ${assets.length} chunks. Consider consolidating smaller chunks to reduce HTTP requests.`
    )
  }
  
  // Check for vendor chunks
  const vendorChunks = assets.filter(asset => 
    asset.path.includes('vendor') || asset.path.includes('node_modules')
  )
  if (vendorChunks.length === 0) {
    recommendations.push(
      'No vendor chunks found. Consider creating separate vendor chunks for better caching.'
    )
  }
  
  return recommendations
}

// Run analysis
analyzeBundle()

