'use client';

import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

interface ResourceProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    url: string;
    file_type: string;
    size_in_bytes: number;
    category?: {
      name: string;
    };
    author: {
      name: string;
    };
    created_at: string;
  };
  onDownload?: (resourceId: string) => Promise<void>;
}

export default function ResourceCard({ resource, onDownload }: ResourceProps) {
  const { t } = useTranslation();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDownload) {
      await onDownload(resource.id);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '🗄️';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const timeAgo = formatDistanceToNow(new Date(resource.created_at), { addSuffix: true });

  return (
    <div className="dashboard-card hover:bg-[var(--bg-tertiary)] transition-colors">
      <div className="flex items-start space-x-4">
        {/* File Type Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center text-2xl">
          {getFileIcon(resource.file_type)}
        </div>

        {/* Resource Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">
              {resource.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mt-2">
            {resource.category && (
              <div className="flex items-center">
                <span className="mr-1">🏷️</span>
                {resource.category.name}
              </div>
            )}
            <div className="flex items-center">
              <span className="mr-1">📁</span>
              {formatFileSize(resource.size_in_bytes)}
            </div>
            <div className="flex items-center">
              <span className="mr-1">👤</span>
              {resource.author.name}
            </div>
            <div className="flex items-center">
              <span className="mr-1">⏰</span>
              {timeAgo}
            </div>
          </div>
        </div>

        {/* Download Button */}
        {onDownload && (
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span className="mr-2">⬇️</span>
            {t('download')}
          </button>
        )}
      </div>
    </div>
  );
}
