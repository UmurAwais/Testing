import Niche from "../models/Niche.js";

/**
 * @desc    Create new niche
 * @route   POST /api/niches
 * @access  Public
 */
export const createNiche = async (req, res) => {
    try {
        const niche = new Niche(req.body);
        await niche.save();
        res.status(201).json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Get all niches
 * @route   GET /api/niches
 * @access  Public
 */
export const getNiches = async (req, res) => {
    try {
        const niches = await Niche.find();
        res.json(niches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Get niche by ID
 * @route   GET /api/niches/:id
 * @access  Public
 */
export const getNicheById = async (req, res) => {
    try {
        const niche = await Niche.findById(req.params.id);
        if (!niche) return res.status(404).json({ error: "Niche not found" });
        res.json(niche);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Get niche by name
 * @route   GET /api/niches/GetNiche/:niche
 * @access  Public
 */
export const getNicheByName = async (req, res) => {
    try {
        console.log("Fetching niche by name:", req.params.niche);
        const niche = await Niche.findOne({ name: req.params.niche });
        if (!niche) return res.status(404).json({ error: "Niche not found" });
        res.json(niche);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Update niche
 * @route   PUT /api/niches/:id
 * @access  Public
 */
export const updateNiche = async (req, res) => {
    try {
        const niche = await Niche.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!niche) return res.status(404).json({ error: "Niche not found" });
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Delete niche
 * @route   DELETE /api/niches/:id
 * @access  Public
 */
export const deleteNiche = async (req, res) => {
    try {
        const niche = await Niche.findByIdAndDelete(req.params.id);
        if (!niche) return res.status(404).json({ error: "Niche not found" });
        res.json({ message: "Niche deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Add product to niche
 * @route   POST /api/niches/:id/product
 * @access  Public
 */
export const addProductToNiche = async (req, res) => {
    try {
        const { name, price, description, imageUrl, imageUrls, discountedPrice } = req.body;
        const niche = await Niche.findById(req.params.id);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        // Handle multiple images: support both imageUrls array and single imageUrl for backward compatibility
        let finalImageUrls = [];

        if (imageUrls) {
            if (Array.isArray(imageUrls)) {
                // Filter out empty strings
                finalImageUrls = imageUrls.filter(url => url && url.trim() !== "");
            } else if (typeof imageUrls === 'string') {
                // If imageUrls is provided as a comma-separated string, split it
                if (imageUrls.includes(',')) {
                    finalImageUrls = imageUrls.split(',').map(url => url.trim()).filter(url => url !== "");
                } else if (imageUrls.trim() !== "") {
                    // Single URL as string
                    finalImageUrls = [imageUrls.trim()];
                }
            }
        } else if (imageUrl) {
            // Backward compatibility: if single imageUrl is provided, convert to array
            finalImageUrls = [imageUrl];
        }

        niche.products.push({
            name,
            price,
            description,
            imageUrl: finalImageUrls[0] || imageUrl || "", // Keep first image for backward compatibility
            imageUrls: finalImageUrls,
            discountedPrice
        });
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Add banner to niche
 * @route   POST /api/niches/:id/banner
 * @access  Public
 */
export const addBannerToNiche = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const niche = await Niche.findById(req.params.id);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        niche.bannerImages.push(imageUrl);
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Add multirow image to niche
 * @route   POST /api/niches/:id/multirow
 * @access  Public
 */
export const addMultiRowImageToNiche = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const niche = await Niche.findById(req.params.id);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        // Limit to 3 multiRow images
        if (niche.multiRowImages && niche.multiRowImages.length >= 3) {
            return res.status(400).json({ error: "Maximum 3 multi-row images allowed" });
        }

        if (!niche.multiRowImages) {
            niche.multiRowImages = [];
        }
        niche.multiRowImages.push(imageUrl);
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Delete product from niche
 * @route   DELETE /api/niches/:nicheId/product/:productId
 * @access  Public
 */
export const deleteProductFromNiche = async (req, res) => {
    try {
        const { nicheId, productId } = req.params;
        console.log("Deleting product:", productId, "from niche:", nicheId);
        const niche = await Niche.findById(nicheId);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        niche.products = niche.products.filter(product => product._id.toString() !== productId);
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Delete banner from niche
 * @route   DELETE /api/niches/:nicheId/banner/:bannerId
 * @access  Public
 */
export const deleteBannerFromNiche = async (req, res) => {
    try {
        const { nicheId, bannerId } = req.params;
        const niche = await Niche.findById(nicheId);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        niche.bannerImages = niche.bannerImages.filter((_, index) => index.toString() !== bannerId);
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Delete multirow image from niche
 * @route   DELETE /api/niches/:nicheId/multirow/:multiRowId
 * @access  Public
 */
export const deleteMultiRowImageFromNiche = async (req, res) => {
    try {
        const { nicheId, multiRowId } = req.params;
        const niche = await Niche.findById(nicheId);
        if (!niche) return res.status(404).json({ error: "Niche not found" });

        if (!niche.multiRowImages) {
            niche.multiRowImages = [];
        }
        niche.multiRowImages = niche.multiRowImages.filter((_, index) => index.toString() !== multiRowId);
        await niche.save();
        res.json(niche);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
