"use client";
import Image from "next/image";
import config from "@/config/config.json";
import { useEffect, useState } from "react";
import { getLatestResults } from "../services/data.services";

interface IntendedGearEvent {
  Frame: number;
  intendedGearEvent: number;
}

interface ActualGearEvent {
  Frame: number;
  actualGearEvent: number;
}

interface IgnitionEvent {
  Frame: number;
  ignitionEvent: boolean;
}

interface parkBrakeEvent {
  Frame: number;
  parkBrakeEvent: boolean;
}

interface ReplayData {
  Time: number;
  RPM: number;
  Speed: number;
  Throttle: number;
  Steering: number;
  Load: number;
}

interface ReplayEvents {
  Name: string;
  RecordedTime: string;
  Value: number;
}

interface ReplayOperatorError {
  Name: string;
  RecordedTime: string;
  EndTime: string;
  Value: number;
}

interface GeneralData {
  InstructorID: string;
  InstructorName: string;
  OperatorID: string;
  OperatorName: string;
  ScenarioName: string;
  Timestamp: string;
  VehicleType: number;
}

interface TotalPoint {
  TotalPoint: number;
}

interface Requirements {
  TestParkingBrake: string;
  TestSecondaryBrake: string;
  TestRetarderBrake: string;
  TestServiceBrake: string;
  TestEmergencySteer: string;
  TestTCS: string;
}

interface SimulationData {
  ActualGearEvent: ActualGearEvent[];
  IntendedGearEvent: IntendedGearEvent[];
  IgnitionEvent: IgnitionEvent[];
  parkBrakeEvent: parkBrakeEvent[];
  ReplayData: ReplayData[];
  ReplayOperatorError: ReplayOperatorError[];
  ReplayEvents: ReplayEvents[];
  GeneralData: GeneralData;
  ExtinguisherEvent: any[];
  radioEvent: any[];
  LoadingUnloadData: any[];
  TotalPoint: TotalPoint;
  Requirements: Requirements;
}

export default function Home() {
  const [resData, setResData] = useState<string | null>(null);
  // const [parsedDataJSON, setParsedDataJSON] = useState<string | null>(null);
  const [parsedDataJSON, setParsedDataJSON] = useState<SimulationData | null>(
    null
  );
  //general data
  const [operatorID, setOperatorID] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState<string | null>(null);
  const [instrukturID, setInstrukturID] = useState<string | null>(null);
  const [instrukturName, setInstrukturName] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<number | string | null>(null);
  //replay data
  const [replayDataID, setReplayDataID] = useState<number | 0>(0);
  const [time, setTime] = useState<number | null>(null);
  const [rpm, setRpm] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [throttle, setThrottle] = useState<number | null>(null);
  const [steering, setSteering] = useState<number | null>(null);
  const [load, setLoad] = useState<number | null>(null);
  //ignition event
  const [ignitionEventID, setIgnitionEventID] = useState<number | 0>(0);
  const [frame, setFrame] = useState<number | null>(null);
  const [ignitionEvent, setIgnitionEvent] = useState<boolean | string>(false);
  //Extinguisher Event
  const [extinguisherEventID, setExtinguisherEventID] = useState<number | 0>(0);
  const [extinguisherEvent, setExtinguisherEvent] = useState<any[] | null>(
    null
  );
  //radio Event
  const [radioEventID, setRadioEventID] = useState<number | 0>(0);
  const [radioEvent, setRadioEvent] = useState<any[] | null>(null);
  //park brake event
  const [parkBrakeEventID, setParkBrakeEventID] = useState<number | 0>(0);
  const [framePB, setFramePB] = useState<number | null>(null);
  const [parkBrakeEvent, setParkBrakeEvent] = useState<boolean | string>(false);
  //Intended Gear event
  const [intendedGearEventID, setIntendedGearEventID] = useState<number | 0>(0);
  const [frameIG, setFrameIG] = useState<number | null>(null);
  const [intendedGearEvent, setIntendedGearEvent] = useState<number | 0>(0);
  //Actual Gear Event
  const [actualGearEventID, setActualGearEventID] = useState<number | 0>(0);
  const [frameAG, setFrameAG] = useState<number | null>(null);
  const [actualGearEvent, setActualGearEvent] = useState<number | 0>(0);
  //Replay Operator Error
  const [replayOperatorErrorID, setReplayOperatorErrorID] = useState<
    number | 0
  >(0);
  const [name, setName] = useState<string | null>(null);
  const [recordedTime, setRecordedTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [value, setValue] = useState<number | 0>(0);
  //Replay Events
  const [replayEventsID, setReplayEventsID] = useState<number | 0>(0);
  const [nameRE, setNameRE] = useState<string | null>(null);
  const [recordedTimeRE, setRecordedTimeRE] = useState<string | null>(null);
  const [valueRE, setValueRE] = useState<number | 0>(0);
  //Total Point
  const [totalPoint, setTotalPoint] = useState<number | null>(null);
  //Loading Unload Data
  const [loadingUnloadDataID, setLoadingUnloadDataID] = useState<number | 0>(0);
  const [loadingUnloadData, setLoadingUnloadData] = useState<any[] | null>(
    null
  );
  //Requirements
  const [testParkingBrake, setTestParkingBrake] = useState<string | null>(null);
  const [testSecondaryBrake, setTestSecondaryBrake] = useState<string | null>(
    null
  );
  const [testRetarderBrake, setTestRetarderBrake] = useState<string | null>(
    null
  );
  const [testServiceBrake, setTestServiceBrake] = useState<string | null>(null);
  const [testEmergencySteer, setTestEmergencySteer] = useState<string | null>(
    null
  );
  const [testTCS, setTestTCS] = useState<string | null>(null);

  // get latest simulation data
  useEffect(() => {
    window.onbeforeunload = () => {
      sessionStorage.removeItem("hasFetched");
    };

    const hasFetched = sessionStorage.getItem("hasFetched");
    if (!hasFetched) {
      const fetchLatestData = async () => {
        try {
          const res = await getLatestResults();
          // console.log(res);
          // console.log(typeof res);
          sessionStorage.setItem("hasFetched", "true");
          setResData(res);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchLatestData();
    }
  }, []);

  useEffect(() => {
    if (resData) {
      try {
        // console.log(resData);
        // console.log(JSON.parse(resData));
        setParsedDataJSON(JSON.parse(resData));
        // console.log(parsedDataJSON);
      } catch (error) {
        console.error("Error no parsed data,", error);
      }
    }
  }, [resData]);

  // init general data
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      console.log(parsedDataJSON);
      // console.log(typeof resData);
      setOperatorID(parsedDataJSON.GeneralData.OperatorID || "-");
      setOperatorName(parsedDataJSON.GeneralData.OperatorName || "-");
      setScenarioName(parsedDataJSON.GeneralData.ScenarioName || "-");
      setInstrukturID(parsedDataJSON.GeneralData.InstructorID || "-");
      setInstrukturName(parsedDataJSON.GeneralData.InstructorName || "-");
      setTimestamp(parsedDataJSON.GeneralData.Timestamp || "-");
      setVehicleType(parsedDataJSON.GeneralData.VehicleType || "-");
      // console.log("oke");
      // console.log(operatorID);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON]);

  // init replay data
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(replayDataID);
      setTime(parsedDataJSON.ReplayData[replayDataID].Time);
      setRpm(parsedDataJSON.ReplayData[replayDataID].RPM);
      setSpeed(parsedDataJSON.ReplayData[replayDataID].Speed);
      setThrottle(parsedDataJSON.ReplayData[replayDataID].Throttle);
      setSteering(parsedDataJSON.ReplayData[replayDataID].Steering);
      setLoad(parsedDataJSON.ReplayData[replayDataID].Load || 0);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, replayDataID]);

  const addReplayDataID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const timeLength = parsedDataJSON.ReplayData.length;

      if (replayDataID + 1 < timeLength) {
        setReplayDataID(replayDataID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractReplayDataID = () => {
    if (replayDataID != 0) {
      setReplayDataID(replayDataID - 1);
    }
  };

  // init ignition event
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      setFrame(parsedDataJSON.IgnitionEvent[ignitionEventID].Frame);
      setIgnitionEvent(
        parsedDataJSON.IgnitionEvent[ignitionEventID].ignitionEvent
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, ignitionEventID]);

  const addIgnitionEventID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const ignitioneventLength = parsedDataJSON.IgnitionEvent.length;

      if (ignitionEventID + 1 < ignitioneventLength) {
        setIgnitionEventID(ignitionEventID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractIgnitionEventID = () => {
    if (ignitionEventID != 0) {
      setIgnitionEventID(ignitionEventID - 1);
    }
  };

  // init Extinguisher Event
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(typeof resData);
      setExtinguisherEvent(
        parsedDataJSON.ExtinguisherEvent[extinguisherEventID] || "-"
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, extinguisherEventID]);

  // init radio Event
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(typeof resData);
      setRadioEvent(parsedDataJSON.radioEvent[radioEventID] || "-");
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, radioEventID]);

  // init prake brake event
  useEffect(() => {
    if (parsedDataJSON) {
      setFramePB(parsedDataJSON.parkBrakeEvent[parkBrakeEventID].Frame);
      setParkBrakeEvent(
        parsedDataJSON.parkBrakeEvent[parkBrakeEventID].parkBrakeEvent
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, parkBrakeEventID]);

  const addParkBrakeEventID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const parkBrakeEventLength = parsedDataJSON.IgnitionEvent.length;

      if (parkBrakeEventID + 1 < parkBrakeEventLength) {
        setParkBrakeEventID(parkBrakeEventID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractParkBrakeEventID = () => {
    if (parkBrakeEventID != 0) {
      setParkBrakeEventID(parkBrakeEventID - 1);
    }
  };

  // init Intended Gear Event
  useEffect(() => {
    if (parsedDataJSON) {
      setFrameIG(parsedDataJSON.IntendedGearEvent[intendedGearEventID].Frame);
      setIntendedGearEvent(
        parsedDataJSON.IntendedGearEvent[intendedGearEventID].intendedGearEvent
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, intendedGearEventID]);

  const addIntendedGearEventID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const intendedGearEventLength = parsedDataJSON.IntendedGearEvent.length;

      if (intendedGearEventID + 1 < intendedGearEventLength) {
        setIntendedGearEventID(intendedGearEventID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractIntendedGearEventID = () => {
    if (intendedGearEventID != 0) {
      setIntendedGearEventID(intendedGearEventID - 1);
    }
  };

  // init Actual Gear Event
  useEffect(() => {
    if (parsedDataJSON) {
      setFrameAG(parsedDataJSON.ActualGearEvent[actualGearEventID].Frame);
      setActualGearEvent(
        parsedDataJSON.ActualGearEvent[actualGearEventID].actualGearEvent
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, actualGearEventID]);

  const addActualGearEventID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const actualGearEventLength = parsedDataJSON.ActualGearEvent.length;

      if (actualGearEventID + 1 < actualGearEventLength) {
        setActualGearEventID(actualGearEventID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractActualGearEventID = () => {
    if (actualGearEventID != 0) {
      setActualGearEventID(actualGearEventID - 1);
    }
  };

  // init Replay Operator Error
  useEffect(() => {
    if (parsedDataJSON) {
      setName(parsedDataJSON.ReplayOperatorError[replayOperatorErrorID].Name);
      setRecordedTime(
        parsedDataJSON.ReplayOperatorError[replayOperatorErrorID].RecordedTime
      );
      setEndTime(
        parsedDataJSON.ReplayOperatorError[replayOperatorErrorID].EndTime
      );
      setValue(parsedDataJSON.ReplayOperatorError[replayOperatorErrorID].Value);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, replayOperatorErrorID]);

  const addReplayOperatorErrorID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const replayOperatorErrorLength =
        parsedDataJSON.ReplayOperatorError.length;

      if (replayOperatorErrorID + 1 < replayOperatorErrorLength) {
        setReplayOperatorErrorID(replayOperatorErrorID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractReplayOperatorErrorID = () => {
    if (replayOperatorErrorID != 0) {
      setReplayOperatorErrorID(replayOperatorErrorID - 1);
    }
  };

  // init Replay Events
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(replayDataID);
      setNameRE(parsedDataJSON.ReplayEvents[replayEventsID].Name);
      setRecordedTimeRE(
        parsedDataJSON.ReplayEvents[replayEventsID].RecordedTime
      );
      setValueRE(parsedDataJSON.ReplayEvents[replayEventsID].Value);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, replayEventsID]);

  const addReplayEventsID = () => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      const timeLength = parsedDataJSON.ReplayEvents.length;

      if (replayEventsID + 1 < timeLength) {
        setReplayEventsID(replayEventsID + 1);
      }

      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  };

  const substractReplayEventsID = () => {
    if (replayEventsID != 0) {
      setReplayEventsID(replayEventsID - 1);
    }
  };

  // init general data
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(typeof resData);
      setTotalPoint(parsedDataJSON.TotalPoint.TotalPoint);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON]);

  // init Loading Unload Data
  useEffect(() => {
    if (parsedDataJSON) {
      // const parsedData = JSON.parse(resData);
      // console.log(typeof resData);
      setLoadingUnloadData(
        parsedDataJSON.LoadingUnloadData[loadingUnloadDataID] || "-"
      );
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON, loadingUnloadDataID]);

  // init Requirements
  useEffect(() => {
    if (parsedDataJSON) {
      setTestParkingBrake(parsedDataJSON.Requirements.TestParkingBrake || "-");
      setTestSecondaryBrake(
        parsedDataJSON.Requirements.TestSecondaryBrake || "-"
      );
      setTestRetarderBrake(
        parsedDataJSON.Requirements.TestRetarderBrake || "-"
      );
      setTestServiceBrake(parsedDataJSON.Requirements.TestServiceBrake || "-");
      setTestEmergencySteer(
        parsedDataJSON.Requirements.TestEmergencySteer || "-"
      );
      setTestTCS(parsedDataJSON.Requirements.TestTCS || "-");
      // console.log("oke");
      // console.log(operatorID);
      try {
      } catch (error) {
        console.error("Error no data available!");
      }
    }
  }, [parsedDataJSON]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)] ">
      <header className="bg-black shadow-lg p-4 fixed top-0 left-0 right-0 w-full z-10 ">
        <div className=" flex justify-between items-center w-full px-4 gap-4">
          <h1 className="title-font ">VSIM</h1>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <h1>Option 1</h1>
            <h1>Option 2</h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start h-full w-full">
        <h1 className="subtitle-font">Simulation Information:</h1>

        {/* General Data */}
        <div className="gap-4 flex flex-col">
          <p className="body-font">General Data</p>{" "}
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
            <li className="mb-2 ">Operator ID: {operatorID}</li>
            <li className="mb-2 ">Operator Name: {operatorName}</li>
            <li className="mb-2 ">Scenario Name: {scenarioName}</li>
            <li className="mb-2 ">Instruktur ID: {instrukturID}</li>
            <li className="mb-2 ">Instruktur Name: {instrukturName}</li>
            <li className="mb-2 ">Timestamp: {timestamp}</li>
            <li className="mb-2 ">Vehicle Type: {vehicleType}</li>
          </ol>
        </div>

        {/* Replay Data */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Replay Data</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Time: {time}</li>
              <li className="mb-2 ">RPM: {rpm}</li>
              <li className="mb-2 ">Speed: {speed}</li>
              <li className="mb-2 ">Throttle: {throttle}</li>
              <li className="mb-2 ">Steering: {steering}</li>
              <li className="mb-2 ">Load: {load}</li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button onClick={substractReplayDataID} className="confirm-button ">
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={replayDataID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.ReplayData.length - 1;
                  setReplayDataID(Math.min(Math.max(newValue, 0), maxBound));
                }
              }}
            />
            <button onClick={addReplayDataID} className="confirm-button ">
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Ignition Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Ignition Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Frame: {frame}</li>
              <li className="mb-2 ">
                Ignition Event: {ignitionEvent.toString()}
              </li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractIgnitionEventID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={ignitionEventID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.IgnitionEvent.length - 1;
                  setIgnitionEventID(Math.min(Math.max(newValue, 0), maxBound));
                }
              }}
            />
            <button onClick={addIgnitionEventID} className="confirm-button ">
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Extinguisher Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Extinguisher Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">{extinguisherEvent}</li>
            </ol>
          </div>
        </div>

        {/* Radio Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Radio Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">{radioEvent}</li>
            </ol>
          </div>
        </div>

        {/* Park Brake Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Park Brake Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Frame: {framePB}</li>
              <li className="mb-2 ">
                Park Brake Event: {parkBrakeEvent.toString()}
              </li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractParkBrakeEventID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={parkBrakeEventID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.parkBrakeEvent.length - 1;
                  setParkBrakeEventID(
                    Math.min(Math.max(newValue, 0), maxBound)
                  );
                }
              }}
            />
            <button onClick={addParkBrakeEventID} className="confirm-button ">
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Intended Gear Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Intended Gear Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Frame: {frameIG}</li>
              <li className="mb-2 ">
                Intended Gear Event: {intendedGearEvent.toString()}
              </li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractIntendedGearEventID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={intendedGearEventID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.IntendedGearEvent.length - 1;
                  setIntendedGearEventID(
                    Math.min(Math.max(newValue, 0), maxBound)
                  );
                }
              }}
            />
            <button
              onClick={addIntendedGearEventID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Actual Gear Event */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Actual Gear Event</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Frame: {frameAG}</li>
              <li className="mb-2 ">
                Actual Gear Event: {actualGearEvent.toString()}
              </li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractActualGearEventID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={intendedGearEventID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.ActualGearEvent.length - 1;
                  setActualGearEventID(
                    Math.min(Math.max(newValue, 0), maxBound)
                  );
                }
              }}
            />
            <button onClick={addActualGearEventID} className="confirm-button ">
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Replay Operator Error */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Replay Operator Error</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Name: {name}</li>
              <li className="mb-2 ">Recorded Time: {recordedTime}</li>
              <li className="mb-2 ">End Time: {endTime}</li>
              <li className="mb-2 ">Value: {value.toString()}</li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractReplayOperatorErrorID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={replayOperatorErrorID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound =
                    parsedDataJSON.ReplayOperatorError.length - 1;
                  setReplayOperatorErrorID(
                    Math.min(Math.max(newValue, 0), maxBound)
                  );
                }
              }}
            />
            <button
              onClick={addReplayOperatorErrorID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* Replay Events */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Replay Events</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Name: {nameRE}</li>
              <li className="mb-2 ">Recorded Time: {recordedTimeRE}</li>
              <li className="mb-2 ">Value: {valueRE.toString()}</li>
            </ol>
          </div>
          <div className="flex items-center absolute right-0 mx-10 gap-12">
            <button
              onClick={substractReplayEventsID}
              className="confirm-button "
            >
              <Image
                className="dark:invert rotate-270"
                src="/vercel.svg"
                alt="time -1"
                width={20}
                height={20}
              />
              Previous
            </button>
            <input
              type="number"
              className="border rounded px-2 py-1 text-center w-16"
              value={replayOperatorErrorID}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                if (!isNaN(newValue) && parsedDataJSON) {
                  const maxBound = parsedDataJSON.ReplayEvents.length - 1;
                  setReplayEventsID(Math.min(Math.max(newValue, 0), maxBound));
                }
              }}
            />
            <button onClick={addReplayEventsID} className="confirm-button ">
              <Image
                className="dark:invert rotate-90"
                src="/vercel.svg"
                alt="time +1"
                width={20}
                height={20}
              />
              Next
            </button>
          </div>
        </div>

        {/* total Point */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Total Point</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Total Point: {totalPoint}</li>
            </ol>
          </div>
        </div>

        {/* Loading Unload Data */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Loading Unload Data</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">{loadingUnloadData}</li>
            </ol>
          </div>
        </div>

        {/* Requirements */}
        <div className=" flex items-center">
          <div className="gap-4 flex flex-col">
            <p className="body-font">Requirements</p>{" "}
            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left tracking-[-.01em]">
              <li className="mb-2 ">Test Parking Brake: {testParkingBrake}</li>
              <li className="mb-2 ">
                Test Secondary Brake: {testSecondaryBrake}
              </li>
              <li className="mb-2 ">
                Test Retarder Brake: {testRetarderBrake}
              </li>
              <li className="mb-2 ">Test Service Brake: {testServiceBrake}</li>
              <li className="mb-2 ">
                Test Emergency Steer: {testEmergencySteer}
              </li>
              <li className="mb-2 ">Test TCS: {testTCS}</li>
            </ol>
          </div>
        </div>
        {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="confirm-button"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className=""
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div> */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
