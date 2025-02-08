import React from 'react';
import { Modal } from 'antd-mobile';
import styles from './index.module.less';

interface ImagePreviewProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  visible,
  imageUrl,
  onClose,
  onDownload,
}) => {
  return (
    <Modal
      visible={visible}
      closeOnMaskClick
      onClose={onClose}
      content={
        <div className={styles.previewContainer}>
          <img src={imageUrl} alt="预览" className={styles.previewImage} />
          <div className={styles.downloadButton} onClick={onDownload}>
            下载图片
          </div>
        </div>
      }
    />
  );
};

export default ImagePreview;