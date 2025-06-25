
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, File, SortAsc, SortDesc, Trash2 } from 'lucide-react';

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
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    // Create a download link for the file
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
      'École': 'bg-blue-100 text-blue-800 border-blue-200',
      'Personnel': 'bg-green-100 text-green-800 border-green-200',
      'Administratif': 'bg-purple-100 text-purple-800 border-purple-200',
      'Projet': 'bg-orange-100 text-orange-800 border-orange-200',
      'Autre': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors['Autre'];
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
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">Mes Documents</h2>
          
          {/* Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-yellow-300 dark:border-gray-600 rounded-lg p-8 text-center bg-yellow-50 dark:bg-gray-700/50 transition-colors duration-300">
              <Upload className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Glissez vos fichiers ici ou cliquez pour sélectionner
              </p>
              
              {/* Category selection for upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie du document
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 mx-auto border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
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
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
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

          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700">
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
            
            {/* Sort Controls */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handleSort('name')}
                className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Nom {getSortIcon('name')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSort('date')}
                className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Date {getSortIcon('date')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSort('size')}
                className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Taille {getSortIcon('size')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSort('category')}
                className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Catégorie {getSortIcon('category')}
              </Button>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredAndSortedDocuments.length === 0 ? (
              <div className="text-center py-12">
                <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || categoryFilter !== 'Toutes' ? 'Aucun document trouvé' : 'Aucun document importé'}
                </p>
              </div>
            ) : (
              filteredAndSortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <File className="h-8 w-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white break-all">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      className="border-yellow-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                      Télécharger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDocument(doc.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsModule;
