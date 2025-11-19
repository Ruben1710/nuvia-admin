import { useState } from 'react';
import { UploadInput } from './UploadInput';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { X } from 'lucide-react';

interface ImageWithModels {
  url: string;
  modelIds: number[];
}

interface ImageWithModelsInputProps {
  value: ImageWithModels[];
  onChange: (value: ImageWithModels[]) => void;
  models: Array<{ size: { en: string; ru: string; arm: string }; priceModifier: number }>;
  locale?: 'en' | 'ru' | 'arm';
}

export function ImageWithModelsInput({
  value,
  onChange,
  models,
  locale = 'ru',
}: ImageWithModelsInputProps) {
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [selectedModelIds, setSelectedModelIds] = useState<number[]>([]);

  const handleAddImage = () => {
    if (newImageUrl && selectedModelIds.length > 0) {
      onChange([...value, { url: newImageUrl, modelIds: selectedModelIds }]);
      setNewImageUrl('');
      setSelectedModelIds([]);
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleModelToggle = (modelId: number) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const getModelLabel = (model: { size: { en: string; ru: string; arm: string } }) => {
    return model.size[locale] || model.size.en;
  };

  const handleImageUrlChange = (url: string | string[]) => {
    if (typeof url === 'string') {
      setNewImageUrl(url);
    } else if (Array.isArray(url) && url.length > 0) {
      setNewImageUrl(url[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Существующие изображения */}
      {value.map((imageWithModels, index) => (
        <div
          key={index}
          className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2">
                <img
                  src={imageWithModels.url}
                  alt={`Image ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Модели:</strong>{' '}
                {imageWithModels.modelIds
                  .map((id) => getModelLabel(models[id]))
                  .join(', ') || 'Нет'}
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Новое поле для добавления изображения */}
      {models.length > 0 && (
        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4">
          <div className="space-y-2">
            <Label>Загрузка изображения</Label>
            <UploadInput
              value={newImageUrl}
              onChange={handleImageUrlChange}
              label=""
            />
          </div>

          <div className="space-y-2">
            <Label>Выберите модели (можно несколько) *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {models.map((model, modelIndex) => (
                <div key={modelIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`model-${modelIndex}`}
                    checked={selectedModelIds.includes(modelIndex)}
                    onCheckedChange={() => handleModelToggle(modelIndex)}
                  />
                  <Label
                    htmlFor={`model-${modelIndex}`}
                    className="text-sm cursor-pointer"
                  >
                    {getModelLabel(model)}
                  </Label>
                </div>
              ))}
            </div>
            {selectedModelIds.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Выберите хотя бы одну модель для добавления фото
              </p>
            )}
          </div>

          {newImageUrl && selectedModelIds.length > 0 && (
            <Button
              type="button"
              onClick={handleAddImage}
              className="w-full"
            >
              Добавить изображение
            </Button>
          )}
        </div>
      )}

      {models.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          Сначала добавьте модели в разделе фильтров
        </div>
      )}
    </div>
  );
}

