import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface SizeOption {
  size: {
    en: string;
    ru: string;
    arm: string;
  };
  priceModifier: number;
}

interface SizeFilterProps {
  value: SizeOption[];
  onChange: (value: SizeOption[]) => void;
  label: string;
}

export function SizeFilter({ value, onChange, label }: SizeFilterProps) {
  const [options, setOptions] = useState<SizeOption[]>(
    value.length > 0
      ? value
      : [
          {
            size: { en: '', ru: '', arm: '' },
            priceModifier: 0,
          },
        ]
  );

  // Синхронизация с внешним value
  useEffect(() => {
    if (value.length > 0) {
      setOptions(value);
    }
  }, [value]);

  const handleAddOption = () => {
    const newOptions = [
      ...options,
      {
        size: { en: '', ru: '', arm: '' },
        priceModifier: 0,
      },
    ];
    setOptions(newOptions);
    onChange(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      onChange(newOptions);
    }
  };

  const handleOptionChange = (index: number, field: keyof SizeOption, newValue: any) => {
    const newOptions = [...options];
    if (field === 'size') {
      newOptions[index] = {
        ...newOptions[index],
        size: { ...newOptions[index].size, ...newValue },
      };
    } else {
      newOptions[index] = {
        ...newOptions[index],
        [field]: newValue,
      };
    }
    setOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="space-y-4 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
      <Label className="text-sm font-semibold">{label}</Label>

      {options.map((option, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Вариант {index + 1}
            </Label>
            {options.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveOption(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor={`size-en-${index}`} className="text-xs">
                Размер (EN) {index === 0 && '*'}
              </Label>
              <Input
                id={`size-en-${index}`}
                value={option.size.en}
                onChange={(e) =>
                  handleOptionChange(index, 'size', { en: e.target.value })
                }
                className="mt-1"
                placeholder="Size in English"
                required={index === 0}
              />
            </div>
            <div>
              <Label htmlFor={`size-ru-${index}`} className="text-xs">
                Размер (RU) {index === 0 && '*'}
              </Label>
              <Input
                id={`size-ru-${index}`}
                value={option.size.ru}
                onChange={(e) =>
                  handleOptionChange(index, 'size', { ru: e.target.value })
                }
                className="mt-1"
                placeholder="Размер на русском"
                required={index === 0}
              />
            </div>
            <div>
              <Label htmlFor={`size-arm-${index}`} className="text-xs">
                Размер (ARM) {index === 0 && '*'}
              </Label>
              <Input
                id={`size-arm-${index}`}
                value={option.size.arm}
                onChange={(e) =>
                  handleOptionChange(index, 'size', { arm: e.target.value })
                }
                className="mt-1"
                placeholder="Չափսը հայերեն"
                required={index === 0}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`price-modifier-${index}`} className="text-xs">
              Модификатор цены
            </Label>
            <Input
              id={`price-modifier-${index}`}
              type="number"
              value={option.priceModifier}
              onChange={(e) =>
                handleOptionChange(index, 'priceModifier', Number(e.target.value) || 0)
              }
              className="mt-1"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddOption} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Добавить вариант
      </Button>
    </div>
  );
}

