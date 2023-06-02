import { View, StyleSheet, Alert, Image, Text } from "react-native";
import { useEffect, useState } from "react";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getAddress, getMapPreview } from "../../util/location";

export default function LocationPicker({ onPickLoc }) {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [pickedLoc, setPickedLoc] = useState();
  const [status, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = route.params && {
        lat: route.params.myLat,
        long: route.params.myLong,
      };

      setPickedLoc(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLoc() {
      if (pickedLoc) {
        const address = await getAddress(pickedLoc.lat, pickedLoc.long);
        onPickLoc({ ...pickedLoc, address });
      }
    }

    handleLoc();
  }, [pickedLoc, onPickLoc]);

  async function verifyPermissions() {
    if (status.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (status.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "you need to grant location permission to use this app."
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLoc({
      lat: location.coords.latitude,
      long: location.coords.longitude,
    });
    console.log(pickedLoc);
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLoc) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{ uri: getMapPreview(pickedLoc.lat, pickedLoc.long) }}
      />
    );
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
