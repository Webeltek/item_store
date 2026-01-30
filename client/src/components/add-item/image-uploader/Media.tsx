import { Card } from './Card.js';
import { Image, ImageUploader } from './ImageUploader.js';
import React, { useEffect } from 'react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { MediaProps } from '../../add-item/AddItem.js';


export default function Media({ addItemForm }) {

  return (
    <Card title="Media">
      <Card.Session>
        <ImageUploader
          currentImages={addItemForm.values.images}
          allowDelete={true}
          allowSwap={true}
          onDelete={(image) => {
            const index = addItemForm.values.images.findIndex(
              (img) => img.uuid === image.uuid
            );
            if (index !== -1) {
              addItemForm.removeListItem('images', index);
            }
          }}
          onUpload={(images) => {
            images.forEach((image) => {
              addItemForm.insertListItem('images', image);
            });
          }}
          onSortEnd={(oldIndex, newIndex) => {
            addItemForm.reorderListItem('images', { from: oldIndex, to: newIndex });
          }}
          targetPath={`catalog/${
            Math.floor(Math.random() * (9999 - 1000)) + 1000
          }/${Math.floor(Math.random() * (9999 - 1000)) + 1000}`}
        />
      </Card.Session>
    </Card>
  );
}

export const layout = {
  areaId: 'leftSide',
  sortOrder: 15
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      image {
        uuid
        path
        url
      }
      gallery {
        uuid
        path
        url
      }
    }
  }
`;
