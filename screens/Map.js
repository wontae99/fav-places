import { useCallback, useLayoutEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/UI/IconButton";

export default function Map({ navigation, route }) {
  const initialLoc = route.params && {
    lat: route.params.initialLat,
    long: route.params.initialLong,
  };

  const [selectedLoc, setSelectedLoc] = useState(initialLoc);

  const region = {
    latitude: initialLoc ? initialLoc.lat : 37.0,
    longitude: initialLoc ? initialLoc.long : 37.0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    if (initialLoc) {
      return;
    }
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setSelectedLoc({ lat: latitude, long: longitude });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLoc) {
      Alert.alert("No location picked!", "You have to pick a location first!");
      return;
    }

    navigation.navigate("AddPlace", {
      myLat: selectedLoc.lat,
      myLong: selectedLoc.long,
    });
  }, [navigation, selectedLoc]);

  useLayoutEffect(() => {
    if (initialLoc) {
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLoc]);

  return (
    <MapView
      initialRegion={region}
      style={styles.map}
      onPress={selectLocationHandler}
    >
      {selectedLoc && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLoc.lat,
            longitude: selectedLoc.long,
          }}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
