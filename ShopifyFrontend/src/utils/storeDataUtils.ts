/**
 * Clear all store-related data from localStorage
 * Use this when starting a fresh store setup
 */
export const clearStoreData = () => {
    const itemsToClear = [
        'selectedNiche',
        'selectedBanners',
        'selectedBannerImages',
        'shopifyAdminUrl',
        'connectShopifyUrl',
        'userProgress'
    ];

    itemsToClear.forEach(item => {
        localStorage.removeItem(item);
    });

    console.log('✅ Store data cleared - ready for new setup');
};

/**
 * Clear only niche and banner selections
 * Use this when changing niche but keeping other data
 */
export const clearNicheSelection = () => {
    localStorage.removeItem('selectedNiche');
    localStorage.removeItem('selectedBanners');
    localStorage.removeItem('selectedBannerImages');

    console.log('✅ Niche selection cleared');
};

/**
 * Get current store setup data
 */
export const getStoreData = () => {
    return {
        niche: localStorage.getItem('selectedNiche'),
        banners: JSON.parse(localStorage.getItem('selectedBanners') || '[]'),
        bannerImages: JSON.parse(localStorage.getItem('selectedBannerImages') || '[]'),
        shopUrl: localStorage.getItem('shopifyAdminUrl'),
        progress: localStorage.getItem('userProgress')
    };
};

/**
 * Check if user is starting a new store setup
 * Returns true if critical data is missing
 */
export const isNewStoreSetup = () => {
    const niche = localStorage.getItem('selectedNiche');
    const banners = localStorage.getItem('selectedBanners');

    return !niche || !banners;
};
