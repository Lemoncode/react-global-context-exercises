import React from 'react';
import { HotelCollectionComponent } from './hotel-collection.component';
import { linkRoutes, history } from 'core/router';
import { useHotelCollection } from './use-hotel-collection.hook';

const InnerHotelCollectionContainer = React.memo(props => {
  const { hotelCollection, onFetchHotelCollection } = props;

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
});

export const HotelCollectionContainer = () => {
  const { hotelCollection, onFetchHotelCollection } = useHotelCollection();

  const handleFetchHotelCollection = React.useCallback(
    onFetchHotelCollection,
    []
  );

  return (
    <InnerHotelCollectionContainer
      hotelCollection={hotelCollection}
      onFetchHotelCollection={handleFetchHotelCollection}
    />
  );
};
