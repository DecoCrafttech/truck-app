import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants";

const EditLoadModal = ({ visible, onClose, onSave, loadDetails }) => {
  const [editedDetails, setEditedDetails] = useState(null);

  useEffect(() => {
    if (loadDetails) {
      setEditedDetails({
        fromLocation: loadDetails.fromLocation || "",
        toLocation: loadDetails.toLocation || "",
        description: loadDetails.description || "",
        material: loadDetails.material || "",
        labels: [
          { icon: "table-view", text: loadDetails.labels[0]?.text || "" },
          { icon: "attractions", text: loadDetails.labels[1]?.text || "" },
          { icon: "monitor-weight", text: loadDetails.labels[2]?.text || "" },
          { icon: "local-shipping", text: loadDetails.labels[3]?.text || "" },
          { icon: "verified", text: loadDetails.labels[4]?.text || "" },
        ],
      });
    } else {
      setEditedDetails(null);
    }
  }, [loadDetails]);

  const handleSave = () => {
    onSave(editedDetails);
  };

  const handleLabelChange = (text, index) => {
    const updatedLabels = [...editedDetails.labels];
    
    // Set default text if 'text' is empty
    if (text === "") {
      text = " "; // Or any other default text you prefer
    }
    
    updatedLabels[index].text = text;
    setEditedDetails({ ...editedDetails, labels: updatedLabels });
  };

  const renderInputs = () => {
    if (!editedDetails) return null;
  
    const filteredLabels = editedDetails.labels.filter(label => label.text !== "");

    console.log(filteredLabels)
  
    return (
      <>
        <TextInput
          style={styles.input}
          value={editedDetails.fromLocation}
          onChangeText={(text) =>
            setEditedDetails({ ...editedDetails, fromLocation: text })
          }
          placeholder="From Location"
        />
        <TextInput
          style={styles.input}
          value={editedDetails.toLocation}
          onChangeText={(text) =>
            setEditedDetails({ ...editedDetails, toLocation: text })
          }
          placeholder="To Location"
        />
        <TextInput
          style={styles.input}
          value={editedDetails.description}
          onChangeText={(text) =>
            setEditedDetails({ ...editedDetails, description: text })
          }
          placeholder="Description"
        />
     
        {filteredLabels.map((data, index) => (
          
          <TextInput
            key={index}
            style={styles.input}
            value={data.text}
            onChangeText={(text) => handleLabelChange(text, index)}
            placeholder={`Label ${index + 1}`}
          />
        ))}
      </>
    );
  };
  

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Edit</Text>
          {renderInputs()}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!visible}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: COLORS.white,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: COLORS.brand,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: COLORS.white,
    textAlign: "center",
  },
});

export default EditLoadModal;
