
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileLibrarySearch } from '@/components/fileLibrary/FileLibrarySearch';
import { FileLibraryItem } from '@/components/fileLibrary/FileLibraryItem';
import { FileLibraryItem as FileItem, FileCategory, SearchFilters } from '@/types/fileLibrary';
import { searchFileLibrary, getFileCategories } from '@/api/fileLibraryApi';
import { Library, FolderOpen } from 'lucide-react';

export default function CompanyFileLibrary() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    visibility: 'company_only'
  });

  useEffect(() => {
    loadCategories();
    handleSearch();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await getFileCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchFileLibrary(filters);
      setFiles(results);
    } catch (error) {
      console.error('Error searching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryStats = () => {
    const stats = categories.map(category => {
      const count = files.filter(file => file.category_name === category.name).length;
      return { ...category, count };
    });
    return stats.filter(stat => stat.count > 0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Library className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">File Library</h1>
        </div>
        <p className="text-gray-600">
          Access and manage your company's file library including tech sheets, wire diagrams, and documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getCategoryStats().map((category) => (
                  <button
                    key={category.id}
                    onClick={() => 
                      setFilters({ 
                        ...filters, 
                        categoryId: filters.categoryId === category.id ? undefined : category.id 
                      })
                    }
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      filters.categoryId === category.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <FileLibrarySearch
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching files...</p>
            </div>
          ) : files.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse different categories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {files.map((file) => (
                <FileLibraryItem key={file.id} file={file} />
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              Showing {files.length} files
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
