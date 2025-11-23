
import React, { useState, useRef } from 'react';
import { useData, MenuItem } from '../context/DataContext';
import { GoogleGenAI, Modality } from "@google/genai";

interface AdminDashboardProps {}

// Helper function for Base64 conversion
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

type AdminTab = 'header' | 'hero' | 'highlights' | 'features' | 'vibe' | 'testimonials' | 'food' | 'drinks' | 'battery' | 'footer';

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { 
    foodMenu, updateFoodMenu, 
    drinksData, updateDrinksData, 
    headerData, updateHeaderData,
    heroData, updateHeroData,
    highlightsData, updateHighlightsData,
    featuresData, updateFeaturesData,
    vibeData, updateVibeData,
    testimonialsData, updateTestimonialsData,
    batteryData, updateBatteryData,
    footerData, updateFooterData,
    resetToDefaults 
  } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('header');

  // AI Generation State for Hero
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([]);
  const [isGeneratingBackgrounds, setIsGeneratingBackgrounds] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // --- Handlers ---
  const handleHeroChange = (field: string, value: string) => {
      updateHeroData({ ...heroData, [field]: value });
  };

  const handleHighlightsChange = (field: string, value: any) => {
      updateHighlightsData({ ...highlightsData, [field]: value });
  };

  const handleFoodChange = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...foodMenu];
    newMenu[catIndex].items[itemIndex] = { ...newMenu[catIndex].items[itemIndex], [field]: value };
    updateFoodMenu(newMenu);
  };

  const handleAddFoodItem = (catIndex: number) => {
    const newMenu = [...foodMenu];
    newMenu[catIndex].items.push({ name: 'New Item', description: 'Description here', price: '0' });
    updateFoodMenu(newMenu);
  };

  const handleDeleteFoodItem = (catIndex: number, itemIndex: number) => {
      if(!confirm("Delete this item?")) return;
      const newMenu = [...foodMenu];
      newMenu[catIndex].items.splice(itemIndex, 1);
      updateFoodMenu(newMenu);
  }

  const handleCocktailChange = (catIndex: number, itemIndex: number, field: string, value: string) => {
      const newDrinks = { ...drinksData };
      newDrinks.cocktailsData[catIndex].items[itemIndex] = { 
          ...newDrinks.cocktailsData[catIndex].items[itemIndex], 
          [field]: value 
      };
      updateDrinksData(newDrinks);
  };

  const handleGenerateBackgrounds = async () => {
    setIsGeneratingBackgrounds(true);
    setGeneratedBackgrounds([]);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        // Define 3 distinct styles/moods based on the current hero text
        const baseContext = heroData.headingText || "Karaoke Club";
        const prompts = [
            `Photorealistic wide shot of a high-energy karaoke club scene in London. ${baseContext}. Neon pink and blue laser lights, happy crowd, cyberpunk party atmosphere. 8k resolution, cinematic lighting, 16:9 aspect ratio.`,
            `Interior design photography of a luxury private karaoke suite. ${baseContext}. Plush velvet sofas, gold accents, dim moody lighting, champagne on table. Sophisticated, exclusive, elegant. 8k resolution, 16:9 aspect ratio.`,
            `Abstract digital art wallpaper for a music venue. ${baseContext}. Vibrant sound waves, musical notes, neon geometric shapes against a dark background, dynamic motion. Modern, artistic, 8k resolution, 16:9 aspect ratio.`
        ];

        const newImages: string[] = [];

        await Promise.all(prompts.map(async (prompt) => {
             try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE] }
                });
                
                // Find image part
                let found = false;
                if (response.candidates?.[0]?.content?.parts) {
                    for (const part of response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            newImages.push(`data:image/png;base64,${part.inlineData.data}`);
                            found = true;
                            break;
                        }
                    }
                }
             } catch (err) {
                 console.error("Failed to generate one image variation", err);
             }
        }));
        
        if (newImages.length > 0) {
            setGeneratedBackgrounds(newImages);
        } else {
            alert("Failed to generate images. Please try again.");
        }

    } catch (error) {
        console.error("Generation failed", error);
        alert("An error occurred while connecting to the AI service.");
    } finally {
        setIsGeneratingBackgrounds(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-400"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
           <div className="mt-6 text-center text-zinc-600 text-xs">
            Hint: admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400">LKC Backend</h2>
          <div className="flex gap-4">
             <button onClick={resetToDefaults} className="text-xs text-red-400 hover:text-red-300 underline">
                Reset All Data
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">
                Logout
            </button>
          </div>
        </div>
        <div className="container mx-auto px-6 flex gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
             {['header', 'hero', 'highlights', 'features', 'vibe', 'testimonials', 'food', 'drinks', 'battery', 'footer'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as AdminTab)}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-yellow-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                    {tab}
                 </button>
             ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">

        {activeTab === 'header' && (
            <div className="space-y-8">
                <SectionCard title="Header Settings" description="Manage the site logo and header elements.">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Logo Image</label>
                    <ImageField url={headerData.logoUrl} onUpdate={(v) => updateHeaderData({...headerData, logoUrl: v})} />
                </SectionCard>
            </div>
        )}
        
        {activeTab === 'hero' && (
            <div className="space-y-8">
                <SectionCard title="Homepage Hero" description="Update the main visuals and text of your landing page.">
                     <div className="grid md:grid-cols-2 gap-6">
                         <InputGroup label="Badge Text" value={heroData.badgeText} onChange={(v) => handleHeroChange('badgeText', v)} />
                         <InputGroup label="Button Text" value={heroData.buttonText} onChange={(v) => handleHeroChange('buttonText', v)} />
                     </div>
                     <InputGroup label="Main Heading" value={heroData.headingText} onChange={(v) => handleHeroChange('headingText', v)} />
                     <InputGroup label="Subtext" value={heroData.subText} onChange={(v) => handleHeroChange('subText', v)} type="textarea" />
                     
                     <div className="border-t border-zinc-800 pt-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Background Image</label>
                        <div className="flex gap-4 items-center">
                            <img src={heroData.backgroundImageUrl} className="w-32 h-20 object-cover rounded border border-zinc-700" />
                            <div className="flex-1">
                                <input 
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-sm focus:border-yellow-400 outline-none mb-2"
                                    value={heroData.backgroundImageUrl}
                                    onChange={(e) => handleHeroChange('backgroundImageUrl', e.target.value)}
                                    placeholder="Image URL..."
                                />
                                <ImageUploader onUpload={(base64) => handleHeroChange('backgroundImageUrl', base64)} />
                            </div>
                        </div>

                        {/* AI Background Generator */}
                        <div className="mt-6 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                             <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-400">AI Background Suggestions</h4>
                                    <p className="text-xs text-gray-500">Generate 3 variants (Party, Luxury, Abstract) based on your heading.</p>
                                </div>
                                <button 
                                    onClick={handleGenerateBackgrounds} 
                                    disabled={isGeneratingBackgrounds}
                                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all flex items-center gap-2"
                                >
                                    {isGeneratingBackgrounds ? (
                                        <span className="block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                    ) : (
                                        <span>✨</span>
                                    )}
                                    {isGeneratingBackgrounds ? 'Generating...' : 'Generate New Options'}
                                </button>
                             </div>
                             
                             {generatedBackgrounds.length > 0 && (
                                 <div className="grid grid-cols-3 gap-4">
                                     {generatedBackgrounds.map((bg, idx) => (
                                         <div key={idx} className="group relative cursor-pointer" onClick={() => handleHeroChange('backgroundImageUrl', bg)}>
                                             <img src={bg} className="w-full h-24 object-cover rounded border-2 border-transparent group-hover:border-yellow-400 transition-all" />
                                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                                 <span className="text-xs font-bold text-white">Use Image</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                             {generatedBackgrounds.length === 0 && !isGeneratingBackgrounds && (
                                 <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded">
                                     <p className="text-xs text-gray-500">No suggestions generated yet.</p>
                                 </div>
                             )}
                        </div>
                     </div>
                </SectionCard>
            </div>
        )}

        {activeTab === 'highlights' && (
             <div className="space-y-8">
                <SectionCard title="Highlights Section" description="Manage the 'Get the party started' section.">
                    <InputGroup label="Heading" value={highlightsData.heading} onChange={(v) => handleHighlightsChange('heading', v)} />
                    <InputGroup label="Subtext" value={highlightsData.subtext} onChange={(v) => handleHighlightsChange('subtext', v)} type="textarea" />
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Main Image</label>
                             <ImageField url={highlightsData.mainImageUrl} onUpdate={(v) => handleHighlightsChange('mainImageUrl', v)} />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Side Circle Image</label>
                             <ImageField url={highlightsData.sideImageUrl} onUpdate={(v) => handleHighlightsChange('sideImageUrl', v)} />
                        </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-800 pt-6">
                         <InputGroup label="List Title" value={highlightsData.featureListTitle} onChange={(v) => handleHighlightsChange('featureListTitle', v)} />
                         <label className="block text-sm font-semibold text-gray-300 mb-2 mt-4">Feature List Items (One per line)</label>
                         <textarea 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:border-yellow-400 outline-none min-h-[150px]"
                            value={highlightsData.featureList.join('\n')}
                            onChange={(e) => handleHighlightsChange('featureList', e.target.value.split('\n'))}
                         />
                    </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'features' && (
             <div className="space-y-8">
                <SectionCard title="Experience Section" description="Top section with large background image">
                     <InputGroup label="Label" value={featuresData.experience.label} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, label: v}})} />
                     <InputGroup label="Heading" value={featuresData.experience.heading} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                     <InputGroup label="Text" value={featuresData.experience.text} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} type="textarea" />
                     <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Background Image</label>
                        <ImageField url={featuresData.experience.image} onUpdate={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: v}})} />
                     </div>
                </SectionCard>

                <SectionCard title="Occasions Section" description="Middle section with 3 cards">
                    <InputGroup label="Main Heading" value={featuresData.occasions.heading} onChange={(v) => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, heading: v}})} />
                    <InputGroup label="Main Text" value={featuresData.occasions.text} onChange={(v) => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, text: v}})} type="textarea" />
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {featuresData.occasions.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700">
                                 <p className="text-xs text-gray-500 mb-2">Card {idx + 1}</p>
                                 <div className="space-y-2">
                                     <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm" value={item.title} onChange={(e) => {
                                         const newItems = [...featuresData.occasions.items];
                                         newItems[idx].title = e.target.value;
                                         updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: newItems}});
                                     }} />
                                     <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm" rows={3} value={item.text} onChange={(e) => {
                                         const newItems = [...featuresData.occasions.items];
                                         newItems[idx].text = e.target.value;
                                         updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: newItems}});
                                     }} />
                                 </div>
                             </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Grid Section" description="Bottom section with images">
                    <InputGroup label="Section Heading" value={featuresData.grid.heading} onChange={(v) => updateFeaturesData({...featuresData, grid: {...featuresData.grid, heading: v}})} />
                    <div className="grid gap-6 mt-6">
                        {featuresData.grid.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700 flex gap-4 flex-col md:flex-row">
                                 <div className="flex-1 space-y-3">
                                     <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm font-bold" value={item.title} onChange={(e) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].title = e.target.value;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                     <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm" rows={2} value={item.description} onChange={(e) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].description = e.target.value;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                 </div>
                                 <div className="w-full md:w-48">
                                     <ImageField url={item.image} onUpdate={(v) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].image = v;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                 </div>
                             </div>
                        ))}
                    </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'vibe' && (
            <div className="space-y-8">
                 <SectionCard title="Vibe (Fitness) Section" description="The 'Heart of the Party' section">
                     <InputGroup label="Label" value={vibeData.label} onChange={(v) => updateVibeData({...vibeData, label: v})} />
                     <InputGroup label="Heading" value={vibeData.heading} onChange={(v) => updateVibeData({...vibeData, heading: v})} />
                     <InputGroup label="Text" value={vibeData.text} onChange={(v) => updateVibeData({...vibeData, text: v})} type="textarea" />
                     
                     <div className="grid md:grid-cols-2 gap-6 mt-6">
                         <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Top Circle Image 1</label>
                             <ImageField url={vibeData.image1} onUpdate={(v) => updateVibeData({...vibeData, image1: v})} />
                         </div>
                         <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Bottom Circle Image 2</label>
                             <ImageField url={vibeData.image2} onUpdate={(v) => updateVibeData({...vibeData, image2: v})} />
                         </div>
                     </div>
                 </SectionCard>

                 <SectionCard title="Bottom Banner" description="Large image section">
                     <InputGroup label="Bottom Heading" value={vibeData.bottomHeading} onChange={(v) => updateVibeData({...vibeData, bottomHeading: v})} />
                     <InputGroup label="Bottom Text" value={vibeData.bottomText} onChange={(v) => updateVibeData({...vibeData, bottomText: v})} type="textarea" />
                     <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Large Banner Image</label>
                        <ImageField url={vibeData.bigImage} onUpdate={(v) => updateVibeData({...vibeData, bigImage: v})} />
                     </div>
                 </SectionCard>
            </div>
        )}

        {activeTab === 'testimonials' && (
            <div className="space-y-8">
                <SectionCard title="Testimonials" description="Customer reviews section">
                     <InputGroup label="Heading" value={testimonialsData.heading} onChange={(v) => updateTestimonialsData({...testimonialsData, heading: v})} />
                     <InputGroup label="Subtext" value={testimonialsData.subtext} onChange={(v) => updateTestimonialsData({...testimonialsData, subtext: v})} type="textarea" />
                     
                     <div className="grid gap-6 mt-6">
                         {testimonialsData.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700 flex flex-col md:flex-row gap-6">
                                 <div className="w-full md:w-24">
                                     <div className="mb-2 text-xs text-gray-500">Avatar</div>
                                     <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-zinc-600">
                                         <img src={item.avatar} className="w-full h-full object-cover" />
                                     </div>
                                     <ImageUploader onUpload={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].avatar = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} label="Upload" />
                                 </div>
                                 <div className="flex-1 space-y-3">
                                     <InputGroup label="Name" value={item.name} onChange={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].name = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} />
                                     <InputGroup label="Quote" value={item.quote} onChange={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].quote = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} type="textarea" />
                                 </div>
                             </div>
                         ))}
                     </div>
                </SectionCard>
            </div>
        )}

        {activeTab === 'battery' && (
            <div className="space-y-8">
                <SectionCard title="Stats Section" description="The 'Songs to choose from' circle">
                    <div className="grid grid-cols-3 gap-4">
                         <InputGroup label="Prefix (Top)" value={batteryData.statPrefix} onChange={(v) => updateBatteryData({...batteryData, statPrefix: v})} />
                         <InputGroup label="Number (Middle)" value={batteryData.statNumber} onChange={(v) => updateBatteryData({...batteryData, statNumber: v})} />
                         <InputGroup label="Suffix (Bottom)" value={batteryData.statSuffix} onChange={(v) => updateBatteryData({...batteryData, statSuffix: v})} />
                    </div>
                    <InputGroup label="Subtext (Below Circle)" value={batteryData.subText} onChange={(v) => updateBatteryData({...batteryData, subText: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'footer' && (
            <div className="space-y-8">
                <SectionCard title="Footer Call to Action" description="The booking prompt at the bottom of the page">
                    <InputGroup label="Heading" value={footerData.ctaHeading} onChange={(v) => updateFooterData({...footerData, ctaHeading: v})} />
                    <InputGroup label="Text" value={footerData.ctaText} onChange={(v) => updateFooterData({...footerData, ctaText: v})} type="textarea" />
                    <InputGroup label="Button Text" value={footerData.ctaButtonText} onChange={(v) => updateFooterData({...footerData, ctaButtonText: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'food' && (
            <div className="space-y-8">
                {foodMenu.map((category, catIndex) => (
                    <SectionCard key={category.category} title={category.category} description="">
                        <div className="space-y-4">
                            {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-zinc-950/50 p-4 rounded-lg">
                                    <div className="md:col-span-3">
                                        <label className="text-xs text-gray-500 block mb-1">Item Name</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            value={item.name}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-6">
                                        <label className="text-xs text-gray-500 block mb-1">Description</label>
                                        <textarea 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            value={item.price}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'price', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-center h-full pt-6">
                                        <button onClick={() => handleDeleteFoodItem(catIndex, itemIndex)} className="text-red-500 hover:bg-red-500/10 p-2 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => handleAddFoodItem(catIndex)}
                                className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors text-sm font-semibold"
                            >
                                + Add Item to {category.category}
                            </button>
                        </div>
                    </SectionCard>
                ))}
            </div>
        )}

        {activeTab === 'drinks' && (
             <div className="space-y-8">
                 <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-6">
                     <p className="text-blue-300 text-sm">Note: Complex pricing structures for bottles and wines are viewed in read-only mode here.</p>
                 </div>

                 <SectionCard title="Menu Header" description="">
                     <label className="block text-sm font-semibold text-gray-300 mb-2">Header Image</label>
                     <ImageField url={drinksData.headerImageUrl || ''} onUpdate={(v) => updateDrinksData({...drinksData, headerImageUrl: v})} />
                 </SectionCard>

                {drinksData.cocktailsData.map((category: any, catIndex: number) => (
                    <SectionCard key={category.category} title={category.category} description="">
                        <div className="space-y-4">
                             {category.items.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-zinc-950/50 p-4 rounded-lg">
                                    <div className="md:col-span-3">
                                        <label className="text-xs text-gray-500 block mb-1">Name</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            value={item.name}
                                            onChange={(e) => handleCocktailChange(catIndex, itemIndex, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-7">
                                        <label className="text-xs text-gray-500 block mb-1">Description</label>
                                        <textarea 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            rows={2}
                                            value={item.description || ''}
                                            onChange={(e) => handleCocktailChange(catIndex, itemIndex, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                            value={item.price}
                                            onChange={(e) => handleCocktailChange(catIndex, itemIndex, 'price', e.target.value)}
                                        />
                                    </div>
                                </div>
                             ))}
                        </div>
                    </SectionCard>
                ))}
             </div>
        )}
      </div>
    </div>
  );
};

// --- Reusable Sub-components ---

const SectionCard: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <div className="bg-zinc-800/50 p-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-yellow-400">{title}</h3>
            {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const InputGroup: React.FC<{ label: string, value: string, onChange: (v: string) => void, type?: 'text' | 'textarea' }> = ({ label, value, onChange, type = 'text' }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
        {type === 'textarea' ? (
            <textarea 
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input 
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:border-yellow-400 outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </div>
);

const ImageField: React.FC<{ url: string, onUpdate: (url: string) => void }> = ({ url, onUpdate }) => (
    <div className="flex gap-4 items-start">
        <img src={url} className="w-24 h-24 object-cover rounded border border-zinc-700 bg-black" />
        <div className="flex-1">
            <input 
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none mb-2"
                value={url}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Image URL..."
            />
            <ImageUploader onUpload={onUpdate} />
        </div>
    </div>
);

const ImageUploader: React.FC<{ onUpload: (base64: string) => void; label?: string }> = ({ onUpload, label = "Upload Image" }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 4 * 1024 * 1024) {
            alert("File is too large. Maximum size is 4MB.");
            return;
        }

        setIsUploading(true);
        try {
            const base64 = await blobToBase64(file);
            onUpload(base64);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to process image.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                ref={inputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            <button 
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs py-2 px-4 rounded flex items-center gap-2 transition-colors shadow-sm"
            >
                 {isUploading ? (
                    <span className="block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                 )}
                 {isUploading ? 'Processing...' : label}
            </button>
        </div>
    );
};

export default AdminDashboard;
