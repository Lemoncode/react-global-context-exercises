import React from 'react';
import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';
import { useTracked } from 'core/context';

export const useHotelCollection = () => {
  const [state, dispatch] = useTracked();

  const onFetchHotelCollection = () => {
    if (state.hotelCollection.length === 0) {
      fetchHotelCollection().then(hotels =>
        dispatch({
          hotelCollection: mapCollection(hotels, mapFromApiToVm),
        })
      );
    }
  };

  return { hotelCollection: state.hotelCollection, onFetchHotelCollection };
};
