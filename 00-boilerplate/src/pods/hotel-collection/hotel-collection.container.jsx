import React from 'react';
import { HotelCollectionComponent } from './hotel-collection.component';
import { useHotelCollection } from './use-hotel-collection.hook';

export const HotelCollectionContainer = props => {
  const { hotelCollection, onFetchHotelCollection } = useHotelCollection();

  const handleEditHotel = hotelId => {
    // TODO: Navigate hotelEdit
  };

  React.useEffect(() => {
    onFetchHotelCollection();
  }, []);

  return (
    <HotelCollectionComponent
      hotelCollection={hotelCollection}
      onEditHotel={handleEditHotel}
    />
  );
};
