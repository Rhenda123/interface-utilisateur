import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, File, SortAsc, SortDesc, Trash2, Search, Filter, Grid3X3, List, Plus, Eye, FolderOpen } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: Date;
  file: File;
}

const CATEGORIES = [
  'École',
  'Personnel',
  'Administratif',
  'Projet',
  'Autre'
];

const DocumentsModule = () => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('skoolife_documents');
    return saved ? JSON.parse(saved).map((doc: any) => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate),
      category: doc.category || 'Autre'
    })) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('Toutes');
  const [selectedCategory, setSelectedCategory] = useState<string>('École');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [mobileView, setMobileView] = useState<'documents' | 'upload'>('documents');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveDocuments = (docs: Document[]) => {
    const docsToSave = docs.map(doc => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      category: doc.category,
      uploadDate: doc.uploadDate.toISOString()
    }));
    localStorage.setItem('skoolife_documents', JSON.stringify(docsToSave));
    setDocuments(docs);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      category: selectedCategory,
      uploadDate: new Date(),
      file
    }));

    saveDocuments([...documents, ...newDocuments]);
    
    // Reset file input and switch to documents view on mobile
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (window.innerWidth < 640) {
      setMobileView('documents');
    }
  };

  const handleSort = (field: 'name' | 'date' | 'size' | 'type' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const deleteDocument = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    saveDocuments(updatedDocs);
  };

  const downloadDocument = (doc: Document) => {
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'École': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      'Personnel': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      'Administratif': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      'Projet': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
      'Autre': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    };
    return colors[category as keyof typeof colors] || colors['Autre'];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'Toutes' || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" /> : <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />;
  };

  // Mobile navigation items
  const mobileNavItems = [
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'upload', label: 'Upload', icon: Plus },
  ];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
        <CardContent className="p-3 sm:p-6 lg:p-8">
          {/* Mobile-First Header */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Mes Documents</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredAndSortedDocuments.length} document{filteredAndSortedDocuments.length !== 1 ? 's' : ''}
                </span>
                {/* Desktop view toggle */}
                <div className="hidden sm:flex items-center gap-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="sm:hidden">
              <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-yellow-200 dark:border-gray-700">
                {mobileNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMobileView(item.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      mobileView === item.id
                        ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Upload Section */}
          {(mobileView === 'upload' || window.innerWidth >= 640) && (
            <div className="mb-6 sm:mb-8">
              <div className="border-2 border-dashed border-yellow-300 dark:border-gray-600 rounded-lg p-4 sm:p-8 text-center bg-yellow-50 dark:bg-gray-700/50 transition-colors duration-300">
                <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                  Glissez vos fichiers ici ou cliquez pour sélectionner
                </p>
                
                {/* Category selection for upload */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie du document
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 mx-auto border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 h-9 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                >
                  Choisir des fichiers
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*"
                />
              </div>
            </div>
          )}

          {/* Mobile Documents Section */}
          {(mobileView === 'documents' || window.innerWidth >= 640) && (
            <>
              {/* Mobile-optimized Search and Filter Controls */}
              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <Input
                      type="text"
                      placeholder="Rechercher des documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 sm:pl-10 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300 h-9 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 h-9 sm:h-10 text-sm sm:text-base">
                        <SelectValue placeholder="Filtrer par catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Toutes">Toutes les catégories</SelectItem>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Mobile-friendly Sort Controls */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => handleSort('name')}
                    className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Nom {getSortIcon('name')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSort('date')}
                    className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Date {getSortIcon('date')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSort('size')}
                    className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Taille {getSortIcon('size')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSort('category')}
                    className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Catégorie {getSortIcon('category')}
                  </Button>
                </div>
              </div>

              {/* Mobile-optimized Documents List */}
              <div className={viewMode === 'grid' && window.innerWidth >= 640 ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2 sm:space-y-4'}>
                {filteredAndSortedDocuments.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <File className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      {searchTerm || categoryFilter !== 'Toutes' ? 'Aucun document trouvé' : 'Aucun document importé'}
                    </p>
                  </div>
                ) : viewMode === 'grid' && window.innerWidth >= 640 ? (
                  // Desktop Grid View
                  filteredAndSortedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                      onClick={() => downloadDocument(doc)}
                    >
                      <div className="text-center mb-3">
                        <div className="text-3xl mb-2">{getFileIcon(doc.type)}</div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate mb-2">
                          {doc.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                      </div>
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div>{formatFileSize(doc.size)}</div>
                        <div>{doc.uploadDate.toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Mobile/Desktop List View
                  filteredAndSortedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between p-3 sm:p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md hover:scale-[1.01] touch-manipulation"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white break-all text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                              {doc.category}
                            </span>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument(doc)}
                          className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors duration-300 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Voir</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-300 h-8 sm:h-9 w-8 sm:w-9 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Mobile Upload */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[#F6C103] to-[#E5AD03] hover:from-[#E5AD03] hover:to-[#D4A103] text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentsModule;
