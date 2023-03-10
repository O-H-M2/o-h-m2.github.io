import React, {useState} from "../../../_snowpack/pkg/react.js";
import {Pane} from "./pane.js";
import styled from "../../../_snowpack/pkg/styled-components.js";
import {ControlRow, Label, Detail, OverflowCell} from "./grid.js";
import {AccentSlider} from "../inputs/accent-slider.js";
import {useDispatch} from "../../../_snowpack/pkg/react-redux.js";
import {useAppSelector} from "../../store/hooks.js";
import {
  getShowDesignTab,
  getDisableFastRemap,
  toggleCreatorMode,
  toggleFastRemap
} from "../../store/settingsSlice.js";
import {getSelectedConnectedDevice} from "../../store/devicesSlice.js";
import {ErrorMessage} from "../styled.js";
const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
`;
const DebugPane = styled(Pane)`
  display: grid;
  max-width: 100vw;
  grid-template-columns: 100vw;
`;
const DiagnosticContainer = styled(Container)`
  border-top: 1px solid var(--color_dark-grey);
  margin-top: 20px;
  padding-top: 20px;
`;
const SettingsErrorMessage = styled(ErrorMessage)`
  margin: 0;
  font-style: italic;
`;
export const Settings = () => {
  const dispatch = useDispatch();
  const showDesignTab = useAppSelector(getShowDesignTab);
  const disableFastRemap = useAppSelector(getDisableFastRemap);
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  return /* @__PURE__ */ React.createElement(DebugPane, null, /* @__PURE__ */ React.createElement(OverflowCell, null, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(ControlRow, null, /* @__PURE__ */ React.createElement(Label, null, "Show Design tab"), /* @__PURE__ */ React.createElement(Detail, null, /* @__PURE__ */ React.createElement(AccentSlider, {
    onChange: () => dispatch(toggleCreatorMode()),
    isChecked: showDesignTab
  }))), /* @__PURE__ */ React.createElement(ControlRow, null, /* @__PURE__ */ React.createElement(Label, null, "Fast Key Mapping"), /* @__PURE__ */ React.createElement(Detail, null, /* @__PURE__ */ React.createElement(AccentSlider, {
    onChange: () => dispatch(toggleFastRemap()),
    isChecked: !disableFastRemap
  }))), /* @__PURE__ */ React.createElement(ControlRow, null, /* @__PURE__ */ React.createElement(Label, null, "Show Diagnostic Information"), /* @__PURE__ */ React.createElement(Detail, null, selectedDevice ? /* @__PURE__ */ React.createElement(AccentSlider, {
    onChange: () => setShowDiagnostics(!showDiagnostics),
    isChecked: showDiagnostics
  }) : /* @__PURE__ */ React.createElement(SettingsErrorMessage, null, "Requires connected device")))), showDiagnostics && selectedDevice ? /* @__PURE__ */ React.createElement(DiagnosticContainer, null, /* @__PURE__ */ React.createElement(ControlRow, null, /* @__PURE__ */ React.createElement(Label, null, "VIA Firmware Protocol"), /* @__PURE__ */ React.createElement(Detail, null, selectedDevice.protocol))) : null));
};
