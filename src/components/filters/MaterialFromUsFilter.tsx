import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MaterialFromUsFilterProps {
  value: {
    required: boolean;
    type: boolean;
    priceModifier: number;
    help: {
      en: string;
      ru: string;
      arm: string;
    };
  };
  onChange: (value: {
    required: boolean;
    type: boolean;
    priceModifier: number;
    help: {
      en: string;
      ru: string;
      arm: string;
    };
  }) => void;
}

export function MaterialFromUsFilter({ value, onChange }: MaterialFromUsFilterProps) {
  const [required, setRequired] = useState(value.required || false);

  // Синхронизация с внешним value
  useEffect(() => {
    setRequired(value.required || false);
  }, [value.required]);

  useEffect(() => {
    if (required && (!value.required || value.type !== true || value.priceModifier !== 0)) {
      // Если required = true, то type всегда true, priceModifier = 0, help = пустой
      onChange({
        required: true,
        type: true,
        priceModifier: 0,
        help: { en: '', ru: '', arm: '' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required]);

  const handleRequiredChange = (checked: boolean) => {
    setRequired(checked);
    if (checked) {
      onChange({
        required: true,
        type: true,
        priceModifier: 0,
        help: { en: '', ru: '', arm: '' },
      });
    } else {
      // Если required = false, сохраняем текущие значения, но type может быть false
      onChange({
        required: false,
        type: value.type,
        priceModifier: value.priceModifier,
        help: value.help,
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="material-required"
          checked={required}
          onCheckedChange={handleRequiredChange}
        />
        <Label htmlFor="material-required" className="text-sm font-semibold">
          Материал от нас обязательно
        </Label>
      </div>

      {!required && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-300">
          <div>
            <Label htmlFor="material-price-modifier" className="text-sm">
              Модификатор цены
            </Label>
            <Input
              id="material-price-modifier"
              type="number"
              value={value.priceModifier}
              onChange={(e) =>
                onChange({
                  ...value,
                  priceModifier: Number(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="material-help-en" className="text-sm">
                Подсказка (EN)
              </Label>
              <Input
                id="material-help-en"
                value={value.help.en}
                onChange={(e) =>
                  onChange({
                    ...value,
                    help: { ...value.help, en: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="Help text in English"
              />
            </div>
            <div>
              <Label htmlFor="material-help-ru" className="text-sm">
                Подсказка (RU)
              </Label>
              <Input
                id="material-help-ru"
                value={value.help.ru}
                onChange={(e) =>
                  onChange({
                    ...value,
                    help: { ...value.help, ru: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="Подсказка на русском"
              />
            </div>
            <div>
              <Label htmlFor="material-help-arm" className="text-sm">
                Подсказка (ARM)
              </Label>
              <Input
                id="material-help-arm"
                value={value.help.arm}
                onChange={(e) =>
                  onChange({
                    ...value,
                    help: { ...value.help, arm: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="Օգնության տեքստ հայերեն"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

