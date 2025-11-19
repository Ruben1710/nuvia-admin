import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, X } from 'lucide-react';
import { uploadsApi } from '@/api/uploads';

interface UploadInputProps {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

export const UploadInput = ({ value, onChange, multiple = false, label }: UploadInputProps) => {
  const [uploading, setUploading] = useState(false);
  const initialPreview = multiple 
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : '');
  const [preview, setPreview] = useState<string | string[]>(initialPreview);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Синхронизация с внешним value
  React.useEffect(() => {
    if (multiple) {
      setPreview(Array.isArray(value) ? value : []);
    } else {
      setPreview(typeof value === 'string' ? value : '');
    }
  }, [value, multiple]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        const fileArray = Array.from(files);
        const result = await uploadsApi.uploadMultipleFiles(fileArray);
        const urls = result.urls;
        console.log('Upload multiple result:', result);
        setPreview(urls);
        onChange(urls as any);
      } else {
        const result = await uploadsApi.uploadFile(files[0]);
        console.log('Upload result:', result);
        setPreview(result.url);
        onChange(result.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index?: number) => {
    if (multiple && Array.isArray(preview)) {
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
      onChange(newPreview as any);
    } else {
      setPreview('');
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="space-y-3">
        {multiple && Array.isArray(preview) ? (
          <div className="space-y-3">
            {preview.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {preview.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('Image load error:', url);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => console.log('Image loaded successfully:', url)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => handleRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Загрузка...' : 'Добавить изображения'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {preview ? (
              <div className="relative inline-block group">
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <img 
                    src={preview as string} 
                    alt="Preview" 
                    className="h-48 w-48 sm:h-64 sm:w-64 object-cover"
                    onError={(e) => {
                      console.error('Image load error:', preview);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log('Image loaded successfully:', preview)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => handleRemove()}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Нажмите для загрузки</p>
                </div>
              </div>
            )}
            <Button
              type="button"
              variant={preview ? "outline" : "default"}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Загрузка...' : preview ? 'Изменить изображение' : 'Загрузить изображение'}
            </Button>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

