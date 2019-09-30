import React from 'react';
import { withRouter } from 'react-router-dom';
import { GlobalStateContext } from 'core/context';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';

const InnerHotelEditContainer = React.memo(props => {
  const { id, hotelCollection, onUpdateHotelCollection } = props;
  const [hotel, setHotel] = React.useState(createEmptyHotel());
  const [hotelErrors, setHotelErrors] = React.useState(
    createEmptyHotelErrors()
  );
  const [cities, setCities] = React.useState([]);

  React.useEffect(() => {
    getCities().then(setCities);
  }, []);

  React.useEffect(() => {
    const selectedHotel = hotelCollection.find(h => h.id === id);
    setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
  }, [id]);

  const onFieldUpdate = (fieldId, value) => {
    setHotel({
      ...hotel,
      [fieldId]: value,
    });

    formValidation.validateField(fieldId, value).then(validationResult => {
      setHotelErrors({
        ...hotelErrors,
        [fieldId]: validationResult,
      });
    });
  };

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        const hotelCollection = hotelCollection.map(h =>
          h.id === hotel.id
            ? {
                ...hotel,
              }
            : h
        );
        onUpdateHotelCollection({ hotelCollection });
        history.push(linkRoutes.hotelCollection);
      } else {
        setHotelErrors(formValidationResult.fieldErrors);
      }
    });
  };

  return (
    <HotelEditComponent
      hotel={hotel}
      cities={cities}
      onFieldUpdate={onFieldUpdate}
      hotelErrors={hotelErrors}
      onSave={handleSave}
    />
  );
});

export const HotelEditContainer = withRouter(props => {
  const { match } = props;
  const { state, dispatch } = React.useContext(GlobalStateContext);
  const handleUpdateHotelCollection = React.useCallback(dispatch, []);

  return (
    <InnerHotelEditContainer
      id={match.params.id}
      hotelCollection={state.hotelCollection}
      onUpdateHotelCollection={handleUpdateHotelCollection}
    />
  );
});
