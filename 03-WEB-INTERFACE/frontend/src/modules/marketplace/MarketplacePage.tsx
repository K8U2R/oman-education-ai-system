import React, { useState } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ExtensionGrid from './components/ExtensionGrid';
import CategoryFilters from './components/CategoryFilters';

const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-8 h-8 text-ide-accent" />
            <h1 className="text-3xl font-bold">سوق الإضافات</h1>
          </div>
          <p className="text-ide-text-secondary">اكتشف وثبت إضافات FlowForge IDE</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="ابحث عن إضافة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4" />
              فلاتر
            </Button>
          </div>
          <CategoryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </Card>

        {/* Extensions Grid */}
        <ExtensionGrid searchQuery={searchQuery} category={selectedCategory} />
      </div>
    </div>
  );
};

export default MarketplacePage;

