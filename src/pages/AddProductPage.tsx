import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Save, Image as ImageIcon, UploadCloud, X, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Eye, FileText, ArrowLeft, RotateCcw, Gift } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';
import { compressImage } from '../lib/imageUtils';

interface AddProductPageProps {
  onNavigate?: (page: string) => void;
}

export function AddProductPage({ onNavigate }: AddProductPageProps) {
  const storeCategories = useMarketplaceData('categories', () => marketplaceStore.getCategories());
  const liveBrands = useMarketplaceData('brands', () => marketplaceStore.getBrands());
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Media State (up to 4 Photos / Logos / Gallery Images) - Empty clean initial state
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [customCategory, setCustomCategory] = useState('');
  const [sellerId, setSellerId] = useState('1');
  const [productType, setProductType] = useState('physical');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [extraDescription, setExtraDescription] = useState('');

  // Sizes State
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');

  // Variants State
  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState('');
  
  // Details & SEO & Shipping State
  const [tax, setTax] = useState('GST 18%');
  const [indicator, setIndicator] = useState('veg');
  const [madeInCountry, setMadeInCountry] = useState('IN');
  const [brand, setBrand] = useState('Generic');
  const [totalAllowedQty, setTotalAllowedQty] = useState('100');
  const [minOrderQty, setMinOrderQty] = useState('1');
  const [stepSize, setStepSize] = useState('1');
  const [hsnCode, setHsnCode] = useState('');
  const [warranty, setWarranty] = useState('');
  const [guarantee, setGuarantee] = useState('');
  
  const [seoTitle, setSeoTitle] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [videoType, setVideoType] = useState('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [deliverableType, setDeliverableType] = useState('all');
  const [zipcodes, setZipcodes] = useState('');
  const [lowStockLimit, setLowStockLimit] = useState('10');
  const [pickupLocation, setPickupLocation] = useState('Main Warehouse');

  // Combo Offer State
  const [isComboOffer, setIsComboOffer] = useState(false);
  const [comboTitle, setComboTitle] = useState('');
  const [comboItems, setComboItems] = useState('');
  const [comboDiscount, setComboDiscount] = useState('');
  const [comboTag, setComboTag] = useState('SUPER COMBO');

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  // Media Handlers (Upload up to 4 Photo / Logo items)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - mediaList.length;
    if (remainingSlots <= 0) {
      alert('Maximum 4 media items (photos/logos) allowed per product.');
      return;
    }

    const filesToProcess: File[] = (Array.from(files) as File[]).slice(0, remainingSlots);
    const newMedia: string[] = [];

    for (const file of filesToProcess) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.82);
        newMedia.push(compressed);
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }

    if (newMedia.length > 0) {
      setMediaList((prev) => [...prev, ...newMedia].slice(0, 4));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrlImage = () => {
    if (!customImageUrl.trim()) return;
    if (mediaList.length >= 4) {
      alert('Maximum 4 media items (photos/logos) allowed per product.');
      return;
    }
    setMediaList([...mediaList, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  const handleSetMainMedia = (index: number) => {
    if (index === 0) return;
    const selected = mediaList[index];
    const filtered = mediaList.filter((_, i) => i !== index);
    setMediaList([selected, ...filtered]);
  };

  // Size Handlers
  const toggleSize = (s: string) => {
    if (sizes.includes(s)) {
      setSizes(sizes.filter(item => item !== s));
    } else {
      setSizes([...sizes, s]);
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (sizeInput.trim() !== '' && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  // Variant Handlers
  const toggleVariant = (v: string) => {
    if (variants.includes(v)) {
      setVariants(variants.filter(item => item !== v));
    } else {
      setVariants([...variants, v]);
    }
  };

  const handleAddCustomVariant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (variantInput.trim() !== '' && !variants.includes(variantInput.trim())) {
      setVariants([...variants, variantInput.trim()]);
      setVariantInput('');
    }
  };

  const removeVariant = (variantToRemove: string) => {
    setVariants(variants.filter(v => v !== variantToRemove));
  };

  // Tag Handlers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleAddTagClick = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Text Editor Toolbar Actions
  const appendToDescription = (textToAppend: string) => {
    setDescription(prev => prev ? `${prev}\n${textToAppend}` : textToAppend);
  };

  // Reset Form Action
  const handleResetForm = () => {
    if (confirm('Are you sure you want to reset all form fields?')) {
      setName('');
      setPrice('');
      setMrp('');
      setCategory('Grocery');
      setCustomCategory('');
      setSizes([]);
      setVariants([]);
      setShortDescription('');
      setDescription('');
      setExtraDescription('');
      setSeoTitle('');
      setSeoKeywords('');
      setSeoDescription('');
      setMediaList([]);
      setTags([]);
      setIsSuccess(false);
    }
  };

  // Save Product Handler
  const handleSaveProduct = (saveAsDraft: boolean = false) => {
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const finalCategory = customCategory.trim() ? customCategory.trim() : category;

    const sellers = marketplaceStore.getSellers();
    const activeSeller = sellers.find(s => s.id === sellerId) || sellers[0];
    
    const rawPrice = price.trim() || '0';
    const formattedPrice = rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`;
    const formattedMrp = mrp.trim() ? (mrp.trim().startsWith('₹') ? mrp.trim() : `₹${mrp.trim()}`) : formattedPrice;

    const primaryImage = mediaList[0] || '';

    marketplaceStore.addProduct({
      name: name.trim(),
      price: formattedPrice,
      mrp: formattedMrp,
      category: finalCategory,
      brand: brand || 'Generic',
      sizes: sizes,
      variants: variants,
      media: mediaList,
      images: mediaList,
      sellerId,
      vendor: activeSeller ? activeSeller.storeName : 'Main Store',
      image: primaryImage,
      shortDescription: shortDescription || description || '',
      description: description || shortDescription || '',
      tag: isComboOffer ? (comboTag || 'SUPER COMBO') : (saveAsDraft ? 'DRAFT' : 'NEW'),
      isComboOffer,
      comboTitle: isComboOffer ? comboTitle : undefined,
      comboItems: isComboOffer ? comboItems : undefined,
      comboDiscount: isComboOffer ? comboDiscount : undefined,
      comboTag: isComboOffer ? comboTag : undefined,
    });

    // Dispatch system events so all views update immediately without needing a page refresh
    marketplaceStore.dispatchAllEvents();

    setIsDraft(saveAsDraft);
    setSuccessMessage(saveAsDraft 
      ? `Product "${name}" saved as Draft successfully!` 
      : `Product "${name}" successfully created! It is now visible under All Products.`
    );
    setIsSuccess(true);

    if (!saveAsDraft) {
      setName('');
      setPrice('');
      setMrp('');
      setShortDescription('');
      setDescription('');
      setMediaList([]);
      setCustomImageUrl('');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Hidden File Input for Photos and Logos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className={`p-5 text-white shadow-xl rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300 ${
          isDraft ? 'bg-amber-600' : 'bg-emerald-600'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isDraft ? '📝' : '🎉'}</span>
            <div>
              <p className="font-bold text-base">{successMessage}</p>
              <p className="text-xs text-white/90">
                {isDraft ? 'Draft saved in seller inventory.' : 'Item is published and live across catalog and search.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigate && (
              <button 
                type="button"
                onClick={() => onNavigate('All Products')} 
                className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                Go to All Products →
              </button>
            )}
            <a 
              href="/#products" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-black/20 text-white font-bold text-xs rounded-xl hover:bg-black/30 transition-all shadow-xs"
            >
              View Storefront ↗
            </a>
            <button type="button" onClick={() => setIsSuccess(false)} className="p-1.5 text-white/80 hover:text-white text-sm font-bold cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-16 z-10 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200/60 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Catalog</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Add Product</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Product</h1>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button 
            type="button"
            onClick={handleResetForm} 
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Form
          </button>
          
          <button 
            type="button"
            onClick={() => handleSaveProduct(true)} 
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            Save Draft
          </button>

          <button 
            type="button"
            onClick={() => handleSaveProduct(false)} 
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save & Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Basic Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Organic Green Tea 250g or Wireless Earbuds Pro" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹499" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Market Retail Price (MRP ₹)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹999" 
                    value={mrp} 
                    onChange={(e) => setMrp(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Vendor / Seller <span className="text-red-500">*</span></label>
                  <select 
                    value={sellerId} 
                    onChange={(e) => setSellerId(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="1">City Square Mart</option>
                    <option value="2">Silicon Valley Store</option>
                    <option value="3">Fresh Organic Foods</option>
                    <option value="4">Amit Grocery Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Type <span className="text-red-500">*</span></label>
                  <select 
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="physical">Physical Goods (Shipped)</option>
                    <option value="digital">Digital Product (Downloadable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea 
                  rows={2} 
                  placeholder="Brief summary of the product displayed on product cards..." 
                  value={shortDescription} 
                  onChange={(e) => setShortDescription(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Attributes & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxation / GST</label>
                  <select 
                    value={tax} 
                    onChange={(e) => setTax(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="GST 18%">GST 18% Standard</option>
                    <option value="GST 12%">GST 12% Reduced</option>
                    <option value="GST 5%">GST 5% Essentials</option>
                    <option value="Exempt 0%">Tax Exempt 0%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dietary / Food Indicator</label>
                  <select 
                    value={indicator} 
                    onChange={(e) => setIndicator(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="none">None (General Goods)</option>
                    <option value="veg">🟢 Vegetarian</option>
                    <option value="nonveg">🔴 Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Made in Country</label>
                  <select 
                    value={madeInCountry} 
                    onChange={(e) => setMadeInCountry(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="IN">🇮🇳 India</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="JP">🇯🇵 Japan</option>
                    <option value="DE">🇩🇪 Germany</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                  <select 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    {liveBrands.filter(b => b.status === 'active').map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    <option value="Generic">Generic / House Brand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Allowed Quantity</label>
                  <input 
                    type="number" 
                    value={totalAllowedQty} 
                    onChange={(e) => setTotalAllowedQty(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Quantity</label>
                  <input 
                    type="number" 
                    value={minOrderQty} 
                    onChange={(e) => setMinOrderQty(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">HSN Code</label>
                  <input 
                    type="text" 
                    value={hsnCode} 
                    onChange={(e) => setHsnCode(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warranty Period</label>
                  <input 
                    type="text" 
                    value={warranty} 
                    onChange={(e) => setWarranty(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Tags</label>
                <div className="w-full min-h-[42px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center focus-within:bg-white focus-within:border-blue-500 transition-all">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg shadow-2xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Add tag and press Enter..." 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 bg-transparent border-none outline-none text-xs font-medium placeholder:text-slate-400 min-w-[150px]" 
                    />
                    {tagInput && (
                      <button 
                        type="button" 
                        onClick={handleAddTagClick}
                        className="px-2 py-1 bg-blue-600 text-white font-bold text-[10px] rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Press Enter or click Add to attach search tags.</p>
              </div>
            </CardContent>
          </Card>

          {/* Combo Offer & Bundle Deals Settings */}
          <Card className={`border-2 transition-all ${isComboOffer ? 'border-amber-400 bg-amber-50/20 shadow-sm' : 'border-slate-200'}`}>
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Gift className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Combo Offer & Bundle Deals</CardTitle>
                  <CardDescription className="text-xs text-slate-500">Configure multi-item promotional bundles, BOGO, or special discount sets</CardDescription>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  checked={isComboOffer} 
                  onChange={(e) => setIsComboOffer(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </CardHeader>
            
            {isComboOffer && (
              <CardContent className="space-y-4 pt-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Combo Offer Title</label>
                    <input 
                      type="text" 
                      value={comboTitle}
                      onChange={(e) => setComboTitle(e.target.value)}
                      placeholder="e.g. Breakfast Essentials Combo (Save 25%)" 
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Combo Badge / Tag</label>
                    <select
                      value={comboTag}
                      onChange={(e) => setComboTag(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                    >
                      <option value="SUPER COMBO">🔥 SUPER COMBO</option>
                      <option value="BUY 1 GET 1">🎁 BUY 1 GET 1 (BOGO)</option>
                      <option value="VALUE BUNDLE">📦 VALUE BUNDLE</option>
                      <option value="FESTIVE COMBO">🎉 FESTIVE COMBO</option>
                      <option value="FAMILY PACK">👨‍👩‍👧‍👦 FAMILY PACK</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Items Included in Combo Bundle</label>
                  <textarea 
                    rows={2}
                    value={comboItems}
                    onChange={(e) => setComboItems(e.target.value)}
                    placeholder="List all bundled items e.g., 1x Milk 1L, 1x Wheat Bread 400g, 1x Butter 100g, 1x Fruit Jam 200g"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Combo Discount / Total Savings Text</label>
                    <input 
                      type="text" 
                      value={comboDiscount}
                      onChange={(e) => setComboDiscount(e.target.value)}
                      placeholder="e.g. ₹85 Instant Discount or 20% Bundle Savings" 
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none" 
                    />
                  </div>
                  <div className="flex items-center p-3 bg-amber-100/60 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                    <span>✨ Combo products highlight bundle savings on store listings and attract higher average order value.</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Detailed Description with Formatting Toolbar */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Detailed Description & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rich Description</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  {/* Functional Formatting Toolbar */}
                  <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => appendToDescription('**Bold Text**')} className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-200 rounded text-xs font-bold" title="Bold">B</button>
                    <button type="button" onClick={() => appendToDescription('*Italic Text*')} className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-200 rounded text-xs italic font-serif" title="Italic">I</button>
                    <button type="button" onClick={() => appendToDescription('<u>Underline Text</u>')} className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-200 rounded text-xs underline" title="Underline">U</button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button type="button" onClick={() => appendToDescription('• Feature item 1\n• Feature item 2')} className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-200 rounded text-xs font-bold" title="Bullet List">• List</button>
                    <button type="button" onClick={() => {
                      const img = prompt('Enter image URL to embed in description:');
                      if (img) appendToDescription(`![Image](${img})`);
                    }} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 hover:bg-slate-200 rounded text-xs font-bold" title="Insert Image">
                      <ImageIcon className="w-3.5 h-3.5" /> Insert Image
                    </button>
                  </div>
                  <textarea 
                    rows={5} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 text-sm font-medium outline-none resize-y" 
                    placeholder="Write a comprehensive product specification and description..."
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Specifications / Usage Notes</label>
                <textarea 
                  rows={3} 
                  value={extraDescription}
                  onChange={(e) => setExtraDescription(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none focus:bg-white focus:ring-2 focus:ring-blue-500" 
                  placeholder="Storage instructions, allergen alerts, or usage guidelines..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">SEO & Search Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Page Title</label>
                <input 
                  type="text" 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Buy Organic Green Tea Online - Best Price" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Keywords</label>
                <input 
                  type="text" 
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="green tea, organic, healthy beverage, daily drinks" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Description</label>
                <textarea 
                  rows={2} 
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Short Google search snippet describing the product offer..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                ></textarea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column (Media Upload & Category) */}
        <div className="space-y-6">
          
          {/* Category Selection */}
          <Card className="border-2 border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-3 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-blue-950">Product Category *</CardTitle>
                <p className="text-[11px] text-blue-700 font-medium">Select or specify custom category</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-2xs">
                {customCategory.trim() ? customCategory : category}
              </span>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <label className="block text-xs font-bold text-slate-700">Select Main Store Category</label>
              <select 
                value={category} 
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCustomCategory('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                {storeCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-bold text-slate-700 mt-2 mb-1">Or Enter Custom Category</label>
                <input 
                  type="text" 
                  placeholder="e.g. Footwear, Organic Spices, Toys"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attach Size Options */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Attach Product Sizes</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Specify available sizes (e.g. S, M, L or 250g, 500g, 1kg)</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              
              {/* Quick Preset Size Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {['S', 'M', 'L', 'XL', 'XXL', '250g', '500g', '1kg', '5kg', 'Free Size'].map((preset) => {
                    const isSelected = sizes.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => toggleSize(preset)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Custom Size</label>
                <form onSubmit={handleAddCustomSize} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. 256GB, Pack of 3, 100ml"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                  >
                    Add Size
                  </button>
                </form>
              </div>

              {/* Attached Sizes List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Attached Sizes ({sizes.length})</label>
                {sizes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No sizes attached yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold rounded-lg">
                        {sz}
                        <button 
                          type="button"
                          onClick={() => removeSize(sz)} 
                          className="hover:text-red-600 cursor-pointer font-bold ml-1 text-slate-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Attach Variant Options */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Attach Product Variants</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Specify colors, flavors, or model variations</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              
              {/* Quick Preset Variant Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Red', 'Blue', 'Black', 'White', 'Vanilla', 'Chocolate', 'Green Tea', 'Standard', 'Pro'].map((preset) => {
                    const isSelected = variants.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => toggleVariant(preset)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Variant Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Custom Variant</label>
                <form onSubmit={handleAddCustomVariant} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Space Gray, Sugar Free, Rose Gold"
                    value={variantInput}
                    onChange={(e) => setVariantInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-purple-500 outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                  >
                    Add Variant
                  </button>
                </form>
              </div>

              {/* Attached Variants List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Attached Variants ({variants.length})</label>
                {variants.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No variants attached yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {variants.map((vr, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold rounded-lg">
                        {vr}
                        <button 
                          type="button"
                          onClick={() => removeVariant(vr)} 
                          className="hover:text-red-600 cursor-pointer font-bold ml-1 text-slate-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Photo & Logo Media Manager (Up to 4 Media Items) */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Product Photos & Logos</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Upload up to 4 photos or logo media files</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                mediaList.length === 4 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {mediaList.length} / 4 Uploaded
              </span>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              
              {/* Media Preview Grid (Up to 4 Items) */}
              <div className="grid grid-cols-2 gap-3">
                {mediaList.map((url, index) => (
                  <div key={index} className="relative group rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-100 aspect-square flex items-center justify-center p-2 shadow-2xs">
                    <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-contain" />
                    
                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {index === 0 ? 'Main Photo/Logo' : `Gallery #${index + 1}`}
                    </div>

                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      {index !== 0 && (
                        <button 
                          type="button"
                          onClick={() => handleSetMainMedia(index)} 
                          className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded shadow-xs hover:bg-blue-700"
                        >
                          Set as Main
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => handleRemoveMedia(index)} 
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded shadow-xs hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty slots placeholders up to 4 */}
                {Array.from({ length: 4 - mediaList.length }).map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-colors aspect-square flex flex-col items-center justify-center p-2 text-center cursor-pointer group"
                  >
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-700">Slot #{mediaList.length + idx + 1}</span>
                    <span className="text-[9px] text-slate-400">Click to Upload</span>
                  </div>
                ))}
              </div>

              {/* Upload Trigger Buttons */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mediaList.length >= 4}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs ${
                    mediaList.length >= 4 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{mediaList.length >= 4 ? 'Maximum 4 Media Limit Reached' : 'Open & Upload Photo / Logo'}</span>
                </button>

                {/* Add Custom Image URL Option */}
                {mediaList.length < 4 && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Or paste image / logo URL..." 
                      value={customImageUrl} 
                      onChange={(e) => setCustomImageUrl(e.target.value)} 
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stock & Pickup Shipping */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Stock & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deliverable Zipcodes</label>
                <input 
                  type="text" 
                  value={zipcodes}
                  onChange={(e) => setZipcodes(e.target.value)}
                  placeholder="e.g. 400001, 110001, All" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Low Stock Limit Alert</label>
                <input 
                  type="number" 
                  value={lowStockLimit}
                  onChange={(e) => setLowStockLimit(e.target.value)}
                  placeholder="e.g. 10" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Warehouse Location</label>
                <select 
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Main Warehouse">Main Warehouse - Central</option>
                  <option value="North Hub">North Hub Fulfillment</option>
                  <option value="South Hub">South Hub Fulfillment</option>
                </select>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
