/**
 * Footer Component - مكون تذييل الصفحة
 *
 * مكون تذييل الصفحة الرئيسي
 */

import React from 'react'
import { ROUTES } from '@/domain/constants/routes.constants'
import './Footer.scss'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* About */}
          <div className="footer__section">
            <h3 className="footer__section-title">Oman Education AI System</h3>
            <p className="footer__section-text">
              نظام تعليمي ذكي متكامل يعتمد على الذكاء الاصطناعي لتطوير المهارات التقنية
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__section-title">روابط سريعة</h3>
            <ul className="footer__links">
              <li>
                <a href={ROUTES.HOME} className="footer__link">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href={ROUTES.DASHBOARD} className="footer__link">
                  لوحة التحكم
                </a>
              </li>
              <li>
                <a href={ROUTES.LESSONS} className="footer__link">
                  الدروس
                </a>
              </li>
              <li>
                <a href={ROUTES.STORAGE} className="footer__link">
                  التخزين
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__section">
            <h3 className="footer__section-title">تواصل معنا</h3>
            <p className="footer__section-text">للمزيد من المعلومات أو الدعم الفني</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© 2024 Oman Education AI System. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
