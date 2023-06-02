import { useCallback, useState } from "react";
import { ScrollView, Text, View, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import { Place } from "../../models/place";

export default function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [pickedImg, setPickedImg] = useState();
  const [pickedLoc, setPickedLoc] = useState();

  function onChangeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function pickImgHandler(imgUri) {
    setPickedImg(imgUri);
  }

  const pickLocHandler = useCallback((location) => {
    setPickedLoc(location);
  }, []);

  function savePlaceHandler() {
    const placeData = new Place(enteredTitle, pickedImg, pickedLoc);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          onChangeText={onChangeTitleHandler}
          value={enteredTitle}
          style={styles.input}
        />
      </View>
      <ImagePicker onPickImg={pickImgHandler} />
      <LocationPicker onPickLoc={pickLocHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
