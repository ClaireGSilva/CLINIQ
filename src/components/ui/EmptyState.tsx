import React from 'react';
import { SearchX, AlertTriangle, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type?: 'empty' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const isError = type === 'error';

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E6E5DE] shadow-xs space-y-4 max-w-lg mx-auto my-6 animate-fade-in-up">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
        isError ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FAF9F5] text-[#838A87] border border-[#E6E5DE]'
      }`}>
        {isError ? <AlertTriangle className="w-7 h-7" /> : <SearchX className="w-7 h-7" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-[#1A1C1A]">
          {title || (isError ? 'Não conseguimos carregar os resultados agora' : 'Não encontramos opções com esses critérios')}
        </h3>
        <p className="text-xs sm:text-sm text-[#68706D] max-w-sm mx-auto leading-relaxed">
          {description || (isError 
            ? 'Pode haver uma oscilação temporária de conexão com o catálogo de consultórios.' 
            : 'Experimente ampliar o raio de distância ou desmarcar filtros restritivos para ver mais opções.')}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        {onAction && (
          <Button
            variant={isError ? 'primary' : 'primary'}
            size="md"
            onClick={onAction}
            className="w-full sm:w-auto"
          >
            {isError ? <RefreshCw className="w-4 h-4 mr-1.5" /> : <SlidersHorizontal className="w-4 h-4 mr-1.5" />}
            <span>{actionLabel || (isError ? 'Tentar novamente' : 'Alterar filtros')}</span>
          </Button>
        )}

        {onSecondaryAction && secondaryActionLabel && (
          <Button
            variant="outline"
            size="md"
            onClick={onSecondaryAction}
            className="w-full sm:w-auto"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
