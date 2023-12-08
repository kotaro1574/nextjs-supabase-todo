"use client";
import React, { useState, useEffect, CSSProperties } from "react";

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  } as CSSProperties,
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
    zIndex: 20,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    border: `2px dashed ${GREY}`,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
    fontSize: 12,
    zIndex: 20,
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    border: `2px dashed ${GREY}`,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
    zIndex: 20,
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
    border: `2px dashed ${GREY_DIM}`,
  } as CSSProperties,
  default: {
    border: `2px dashed ${GREY}`,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export default function CSVReader({
  setUploadedData,
}: {
  setUploadedData: (data: any) => void;
}) {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const [uploadedList, setUploadedList] = useState<any[]>([]);

  useEffect(() => {}, [uploadedList]);

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setUploadedList([]);
        const _uploadedData = results.data ?? [];

        if (_uploadedData.length > 0) {
          setUploadedList(_uploadedData.slice(1));
          setUploadedData(_uploadedData.slice(1));
        }
        // console.log('---------------------------');
        // console.log(results);
        // console.log('---------------------------');
        setZoneHover(false);
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}
            className="flex mb-4"
          >
            {acceptedFile ? (
              <>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <span className="text-lg">{acceptedFile.name}</span>
                    <span className="text-lg px-4"> - </span>
                    <span className="text-lg mr-4">
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <div
                      {...getRemoveFileProps()}
                      onMouseOver={(event: Event) => {
                        event.preventDefault();
                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event: Event) => {
                        event.preventDefault();
                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                      onClick={(event: Event) => {
                        getRemoveFileProps().onClick(event);
                        // event.preventDefault();

                        // console.log('remove clicked');
                        setUploadedList([]);
                        setUploadedData([]);
                        // Your code here
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                  <div className="flex">
                    <ProgressBar />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex">
                <span className="text-lg">
                  クリックまたはドラッグ&ドロップでCSVファイルをアップロードしてください。
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
