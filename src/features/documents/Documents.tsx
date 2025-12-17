import { useState } from "react";
import { Folder } from "./Folder";
import { Upload } from "./Upload";
import { Files } from "./Files";

type TabType = "folder" | "upload" | "files";

export function Documents() {
  const [activeTab, setActiveTab] = useState<TabType>("folder");
  const [prevTab, setPrevTab] = useState<TabType>("folder");

  const handleTabChange = (tabId: TabType) => {
    setPrevTab(activeTab);
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "folder", label: "Folder" },
    { id: "upload", label: "Upload" },
    { id: "files", label: "Files" },
  ];

  // Determine animation direction
  const getAnimationClass = (tabId: TabType) => {
    if (tabId !== activeTab) return "hidden";

    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const prevTabIndex = tabs.findIndex(t => t.id === prevTab);

    if (tabIndex > prevTabIndex) {
      return "animate-fadeInRight";
    } else if (tabIndex < prevTabIndex) {
      return "animate-fadeInLeft";
    }
    return "animate-fadeIn";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Documents</h1>
      </div>
      
      {/* Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-dark-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`px-6 py-4 text-sm font-medium relative transition-all duration-300 ease-in-out ${activeTab === tab.id
                ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-card/50"
                }`}
              style={{
                borderTopLeftRadius: tab.id === tabs[0].id ? '0.75rem' : '0',
                borderTopRightRadius: tab.id === tabs[tabs.length - 1].id ? '0.75rem' : '0'
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
        
        {/* Tab Content with Slide Animation */}
        <div className="overflow-hidden">
          <div className={`${getAnimationClass("folder")}`}>
            <Folder />
          </div>
          <div className={`${getAnimationClass("upload")}`}>
            <Upload />
          </div>
          <div className={`${getAnimationClass("files")}`}>
            <Files />
          </div>
        </div>
      </div>
    </div>
  );
}