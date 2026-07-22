import React from 'react'

const ShopifyBadges = ({ className = 'mb-10' }) => {
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <div className="inline-flex items-center gap-[11px] border border-ecomlly-line-s bg-[rgba(20,60,38,0.035)] py-2.25 pr-4 pl-2.5 rounded-full">
        <img 
          src="/shopify-experts.png" 
          alt="Shopify Experts" 
          className="h-6 w-auto block" 
        />
      </div>
      <div className="inline-flex items-center gap-[11px] border border-ecomlly-line-s bg-[rgba(20,60,38,0.035)] py-2.25 pr-4 pl-2.5 rounded-full">
        <img 
          src="/shopify-partners.png" 
          alt="Shopify Partners" 
          className="h-6 w-auto block" 
        />
      </div>
    </div>
  )
}

export default ShopifyBadges
