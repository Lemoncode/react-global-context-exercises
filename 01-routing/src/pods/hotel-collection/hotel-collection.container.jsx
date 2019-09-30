import React from 'react';
import { linkRoutes, history } from 'core/router';
import { HotelCollectionComponent } from './hotel-collection.component';
import { useHotelCollection } from './use-hotel-collection.hook';

export const HotelCollectionContainer = props => {
  const { hotelCollection, onFetchHotelCollection } = useHotelCollection();

  const handleEditHotel = hotelId => {
    const route = linkRoutes.hotelEdit(hotelId);
    history.push(route);
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
