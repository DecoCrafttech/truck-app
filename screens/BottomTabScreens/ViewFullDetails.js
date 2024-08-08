import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import axios from "axios";

const ViewFullDetails = ({ route }) => {
  const { vehicleNo } = route.params;

  const [vehicleData, setVehicleData] = useState([
    {
      blacklist_status: null,
      body_type: "",
      color: "",
      cubic_capacity: "",
      father_name: "",
      financed: "",
      financer: "",
      fit_up_to: "",
      fuel_type: "",
      insurance_company: "",
      insurance_policy_number: "",
      insurance_upto: "",
      latest_by: "",
      less_info: "",
      maker_description: "",
      maker_model: "",
      manufacturing_date: "",
      manufacturing_date_formatted: "",
      mobile_number: "",
      national_permit_issued_by: null,
      national_permit_number: null,
      national_permit_upto: null,
      no_cylinders: "",
      noc_details: null,
      non_use_from: null,
      non_use_status: null,
      non_use_to: null,
      norms_type: "",
      owner_name: "",
      owner_number: "",
      permanent_address: "",
      permit_issue_date: null,
      permit_number: "",
      permit_type: "",
      permit_valid_from: null,
      permit_valid_upto: null,
      present_address: "",
      pucc_number: "",
      pucc_upto: "",
      rc_number: "",
      rc_status: "",
      registered_at: "",
      registration_date: "",
      seat_capacity: "",
      sleeper_capacity: "",
      standing_capacity: "",
      tax_paid_upto: "",
      tax_upto_paid: "",
      unladen_weight: "",
      variant: null,
      vehicle_category: "",
      vehicle_category_description: "",
      vehicle_chasi_number: "",
      vehicle_engine_number: "",
      vehicle_gross_weight: "",
      wheelbase: "",
    },
  ]);



  // const [vehicleData, setVehicleData] = useState([])

  useEffect(() => {


    const viewFullVehicleDetails = async () => {
      const viewVehicleParams = {
        "vehicle_no": `${vehicleNo}`
      }
      try {
        const response = await axios.post("https://truck.truckmessage.com/get_vehicle_details", viewVehicleParams)
          if (response.data.error_code === 0) {
            setVehicleData(response.data.data)
          } else {
            console.log(response.data.message)
          }
      } catch (err) {
        console.log(err)
      }
    }

    (async => viewFullVehicleDetails())()

   
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="View Full Truck Details" />
        <ScrollView contentContainerStyle={styles.container}>
          {vehicleData.map((vehicle, index) => (

            <View key={index} style={styles.itemContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Owner Name</Text>
                <Text style={styles.value}>
                  {vehicle.owner_name === "" || vehicle.owner_name === null || vehicle.owner_name === undefined ? "NA" : vehicle.owner_name}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Body Type</Text>
                <Text style={styles.value}>
                  {vehicle.body_type === "" || vehicle.body_type === null || vehicle.body_type === undefined ? "NA" : vehicle.body_type}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Color</Text>
                <Text style={styles.value}>
                  {vehicle.color === "" || vehicle.color === null || vehicle.color === undefined ? "NA" : vehicle.color}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Cubic Capacity</Text>
                <Text style={styles.value}>
                  {vehicle.cubic_capacity === "" || vehicle.cubic_capacity === null || vehicle.cubic_capacity === undefined ? "NA" : vehicle.cubic_capacity}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Father's Name</Text>
                <Text style={styles.value}>
                  {/* {vehicle.father_name} */}
                  {vehicle.father_name === "" || vehicle.father_name === null || vehicle.father_name === undefined ? "NA" : vehicle.father_name}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Financed</Text>
                <Text style={styles.value}>
                  {/* {vehicle.financed} */}
                  {vehicle.financed === "" || vehicle.financed === null || vehicle.financed === undefined ? "NA" : vehicle.financed}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Financer</Text>
                <Text style={styles.value}>
                  {/* {vehicle.financer} */}
                  {vehicle.financer === "" || vehicle.financer === null || vehicle.financer === undefined ? "NA" : vehicle.financer}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Fit Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.fit_up_to} */}
                  {vehicle.fit_up_to === "" || vehicle.fit_up_to === null || vehicle.fit_up_to === undefined ? "NA" : vehicle.fit_up_to}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Fuel Type</Text>
                <Text style={styles.value}>
                  {/* {vehicle.fuel_type} */}
                  {vehicle.fuel_type === "" || vehicle.fuel_type === null || vehicle.fuel_type === undefined ? "NA" : vehicle.fuel_type}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Insurance Company</Text>
                <Text style={styles.value}>
                  {/* {vehicle.insurance_company} */}
                  {vehicle.insurance_company === "" || vehicle.insurance_company === null || vehicle.insurance_company === undefined ? "NA" : vehicle.insurance_company}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Insurance Policy Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.insurance_policy_number} */}
                  {vehicle.insurance_policy_number === "" || vehicle.insurance_policy_number === null || vehicle.insurance_policy_number === undefined ? "NA" : vehicle.insurance_policy_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Insurance Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.insurance_upto} */}
                  {vehicle.insurance_upto === "" || vehicle.insurance_upto === null || vehicle.insurance_upto === undefined ? "NA" : vehicle.insurance_upto}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Latest By</Text>
                <Text style={styles.value}>
                  {/* {vehicle.latest_by} */}
                  {vehicle.latest_by === "" || vehicle.latest_by === null || vehicle.latest_by === undefined ? "NA" : vehicle.latest_by}


                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Less Info</Text>
                <Text style={styles.value}>
                  {/* {vehicle.less_info} */}
                  {vehicle.less_info === "" || vehicle.less_info === null || vehicle.less_info === undefined ? "NA" : vehicle.less_info}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Maker Description</Text>
                <Text style={styles.value}>
                  {/* {vehicle.maker_description} */}
                  {vehicle.maker_description === "" || vehicle.maker_description === null || vehicle.maker_description === undefined ? "NA" : vehicle.maker_description}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Maker Model</Text>
                <Text style={styles.value}>
                  {/* {vehicle.maker_model} */}
                  {vehicle.maker_model === "" || vehicle.maker_model === null || vehicle.maker_model === undefined ? "NA" : vehicle.maker_model}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Manufacturing Date</Text>
                <Text style={styles.value}>
                  {/* {vehicle.manufacturing_date} */}
                  {vehicle.manufacturing_date === "" || vehicle.manufacturing_date === null || vehicle.manufacturing_date === undefined ? "NA" : vehicle.manufacturing_date}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.mobile_number} */}
                  {vehicle.mobile_number === "" || vehicle.mobile_number === null || vehicle.mobile_number === undefined ? "NA" : vehicle.mobile_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>National Permit Issued By</Text>
                <Text style={styles.value}>
                  {/* {vehicle.national_permit_issued_by} */}
                  {vehicle.national_permit_issued_by === "" || vehicle.national_permit_issued_by === null || vehicle.national_permit_issued_by === undefined ? "NA" : vehicle.national_permit_issued_by}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>National Permit Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.national_permit_number} */}
                  {vehicle.national_permit_number === "" || vehicle.national_permit_number === null || vehicle.national_permit_number === undefined ? "NA" : vehicle.national_permit_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>National Permit Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.national_permit_upto} */}
                  {vehicle.national_permit_upto === "" || vehicle.national_permit_upto === null || vehicle.national_permit_upto === undefined ? "NA" : vehicle.national_permit_upto}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Number of Cylinders</Text>
                <Text style={styles.value}>
                  {/* {vehicle.no_cylinders} */}
                  {vehicle.no_cylinders === "" || vehicle.no_cylinders === null || vehicle.no_cylinders === undefined ? "NA" : vehicle.no_cylinders}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>NOC Details</Text>
                <Text style={styles.value}>
                  {/* {vehicle.noc_details} */}
                  {vehicle.noc_details === "" || vehicle.noc_details === null || vehicle.noc_details === undefined ? "NA" : vehicle.noc_details}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Non Use From</Text>
                <Text style={styles.value}>
                  {/* {vehicle.non_use_from} */}
                  {vehicle.non_use_from === "" || vehicle.non_use_from === null || vehicle.non_use_from === undefined ? "NA" : vehicle.non_use_from}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Non Use Status</Text>
                <Text style={styles.value}>
                  {/* {vehicle.non_use_status} */}
                  {vehicle.non_use_status === "" || vehicle.non_use_status === null || vehicle.non_use_status === undefined ? "NA" : vehicle.non_use_status}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Non Use To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.non_use_to} */}
                  {vehicle.non_use_to === "" || vehicle.non_use_to === null || vehicle.non_use_to === undefined ? "NA" : vehicle.non_use_to}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Norms Type</Text>
                <Text style={styles.value}>
                  {/* {vehicle.norms_type} */}
                  {vehicle.norms_type === "" || vehicle.norms_type === null || vehicle.norms_type === undefined ? "NA" : vehicle.norms_type}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permanent Address</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permanent_address} */}
                  {vehicle.permanent_address === "" || vehicle.permanent_address === null || vehicle.permanent_address === undefined ? "NA" : vehicle.permanent_address}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permit Issue Date</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permit_issue_date} */}
                  {vehicle.permit_issue_date === "" || vehicle.permit_issue_date === null || vehicle.permit_issue_date === undefined ? "NA" : vehicle.permit_issue_date}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permit Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permit_number} */}
                  {vehicle.permit_number === "" || vehicle.permit_number === null || vehicle.permit_number === undefined ? "NA" : vehicle.permit_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permit Type</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permit_type} */}
                  {vehicle.permit_type === "" || vehicle.permit_type === null || vehicle.permit_type === undefined ? "NA" : vehicle.permit_type}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permit Valid From</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permit_valid_from} */}
                  {vehicle.permit_valid_from === "" || vehicle.permit_valid_from === null || vehicle.permit_valid_from === undefined ? "NA" : vehicle.permit_valid_from}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Permit Valid Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.permit_valid_upto} */}
                  {vehicle.permit_valid_upto === "" || vehicle.permit_valid_upto === null || vehicle.permit_valid_upto === undefined ? "NA" : vehicle.permit_valid_upto}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Present Address</Text>
                <Text style={styles.value}>
                  {/* {vehicle.present_address} */}
                  {vehicle.present_address === "" || vehicle.present_address === null || vehicle.present_address === undefined ? "NA" : vehicle.present_address}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>PUCC Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.pucc_number} */}
                  {vehicle.pucc_number === "" || vehicle.pucc_number === null || vehicle.pucc_number === undefined ? "NA" : vehicle.pucc_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>PUCC Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.pucc_upto} */}
                  {vehicle.pucc_upto === "" || vehicle.pucc_upto === null || vehicle.pucc_upto === undefined ? "NA" : vehicle.pucc_upto}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>RC Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.rc_number} */}
                  {vehicle.rc_number === "" || vehicle.rc_number === null || vehicle.rc_number === undefined ? "NA" : vehicle.rc_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>RC Status</Text>
                <Text style={styles.value}>
                  {/* {vehicle.rc_status} */}
                  {vehicle.rc_status === "" || vehicle.rc_status === null || vehicle.rc_status === undefined ? "NA" : vehicle.rc_status}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Registered At</Text>
                <Text style={styles.value}>
                  {/* {vehicle.registered_at} */}
                  {vehicle.registered_at === "" || vehicle.registered_at === null || vehicle.registered_at === undefined ? "NA" : vehicle.registered_at}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Registration Date</Text>
                <Text style={styles.value}>
                  {/* {vehicle.registration_date} */}
                  {vehicle.registration_date === "" || vehicle.registration_date === null || vehicle.registration_date === undefined ? "NA" : vehicle.registration_date}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Seat Capacity</Text>
                <Text style={styles.value}>
                  {/* {vehicle.seat_capacity} */}
                  {vehicle.seat_capacity === "" || vehicle.seat_capacity === null || vehicle.seat_capacity === undefined ? "NA" : vehicle.seat_capacity}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Sleeper Capacity</Text>
                <Text style={styles.value}>
                  {/* {vehicle.sleeper_capacity} */}
                  {vehicle.sleeper_capacity === "" || vehicle.sleeper_capacity === null || vehicle.sleeper_capacity === undefined ? "NA" : vehicle.sleeper_capacity}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Standing Capacity</Text>
                <Text style={styles.value}>
                  {/* {vehicle.standing_capacity} */}
                  {vehicle.standing_capacity === "" || vehicle.standing_capacity === null || vehicle.standing_capacity === undefined ? "NA" : vehicle.standing_capacity}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Tax Paid Up To</Text>
                <Text style={styles.value}>
                  {/* {vehicle.tax_paid_upto} */}
                  {vehicle.tax_paid_upto === "" || vehicle.tax_paid_upto === null || vehicle.tax_paid_upto === undefined ? "NA" : vehicle.tax_paid_upto}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Tax Up To Paid</Text>
                <Text style={styles.value}>
                  {/* {vehicle.tax_upto_paid} */}
                  {vehicle.tax_upto_paid === "" || vehicle.tax_upto_paid === null || vehicle.tax_upto_paid === undefined ? "NA" : vehicle.tax_upto_paid}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Unladen Weight</Text>
                <Text style={styles.value}>
                  {/* {vehicle.unladen_weight} */}
                  {vehicle.unladen_weight === "" || vehicle.unladen_weight === null || vehicle.unladen_weight === undefined ? "NA" : vehicle.unladen_weight}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Variant</Text>
                <Text style={styles.value}>
                  {/* {vehicle.variant} */}
                  {vehicle.variant === "" || vehicle.variant === null || vehicle.variant === undefined ? "NA" : vehicle.variant}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Vehicle Category</Text>
                <Text style={styles.value}>
                  {/* {vehicle.vehicle_category} */}
                  {vehicle.vehicle_category === "" || vehicle.vehicle_category === null || vehicle.vehicle_category === undefined ? "NA" : vehicle.vehicle_category}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Vehicle Category Description</Text>
                <Text style={styles.value}>
                  {/* {vehicle.vehicle_category_description} */}
                  {vehicle.vehicle_category_description === "" || vehicle.vehicle_category_description === null || vehicle.vehicle_category_description === undefined ? "NA" : vehicle.vehicle_category_description}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Vehicle Chassis Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.vehicle_chasi_number} */}
                  {vehicle.vehicle_chasi_number === "" || vehicle.vehicle_chasi_number === null || vehicle.vehicle_chasi_number === undefined ? "NA" : vehicle.vehicle_chasi_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Vehicle Engine Number</Text>
                <Text style={styles.value}>
                  {/* {vehicle.vehicle_engine_number} */}
                  {vehicle.vehicle_engine_number === "" || vehicle.vehicle_engine_number === null || vehicle.vehicle_engine_number === undefined ? "NA" : vehicle.vehicle_engine_number}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Vehicle Gross Weight</Text>
                <Text style={styles.value}>
                  {/* {vehicle.vehicle_gross_weight} */}
                  {vehicle.vehicle_gross_weight === "" || vehicle.vehicle_gross_weight === null || vehicle.vehicle_gross_weight === undefined ? "NA" : vehicle.vehicle_gross_weight}

                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Wheelbase</Text>
                <Text style={styles.value}>
                  {/* {vehicle.wheelbase} */}
                  {vehicle.wheelbase === "" || vehicle.wheelbase === null || vehicle.wheelbase === undefined ? "NA" : vehicle.wheelbase}

                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 12,

  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  textContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
});

export default ViewFullDetails;
