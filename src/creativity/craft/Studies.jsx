import React, { useEffect, useRef, useState } from "react";
import {
  Aperture,
  Check,
  CheckCheck,
  Compass,
  Fingerprint,
  Layers,
  List,
  Music2,
  PanelsTopLeft,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import "./studies.css";

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

export function PrecisionDial({ initialValue = 64, onChange }) {
  const [value, setValue] = useState(clamp(initialValue));
  const drag = useRef(null);
  function update(next) {
    const v = clamp(next);
    setValue(v);
    onChange?.(v);
  }
  function keyDown(e) {
    const delta = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 10,
      PageDown: -10,
    };
    if (e.key in delta || ["Home", "End"].includes(e.key)) {
      e.preventDefault();
      update(
        e.key === "Home" ? 0 : e.key === "End" ? 100 : value + delta[e.key],
      );
    }
  }
  return (
    <div className="dial-study">
      <div
        className="dial-gauge"
        role="slider"
        tabIndex={0}
        aria-label="Intensity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={value + " percent"}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, x: e.clientX, value };
          e.currentTarget.focus();
        }}
        onPointerMove={(e) => {
          if (drag.current)
            update(
              drag.current.value +
                (drag.current.y - e.clientY + e.clientX - drag.current.x) *
                  0.65,
            );
        }}
        onPointerUp={() => (drag.current = null)}
        onLostPointerCapture={() => (drag.current = null)}
        onKeyDown={keyDown}
      >
        {Array.from({ length: 39 }, (_, i) => (
          <i
            key={i}
            className={"dial-tick " + (i % 3 === 0 ? "major" : "")}
            style={{ transform: "rotate(" + (-140 + (i * 280) / 38) + "deg)" }}
          />
        ))}
        <div className="dial-knob">
          <div
            className="dial-face"
            style={{ transform: "rotate(" + (-140 + value * 2.8) + "deg)" }}
          >
            <b />
          </div>
        </div>
      </div>
      <output className="dial-reading">
        {String(value).padStart(2, "0")}
        <span>%</span>
      </output>
    </div>
  );
}

const dockItems = [
  { name: "Explore", Icon: Compass },
  { name: "Studio", Icon: Aperture },
  { name: "Effects", Icon: Sparkles },
  { name: "Music", Icon: Music2 },
];
export function MagneticDock({ onSelect }) {
  const [over, setOver] = useState(null),
    [selected, setSelected] = useState(null);
  return (
    <div className="dock-study">
      <div
        className="dock-body"
        role="group"
        aria-label="Tool dock"
        onPointerLeave={() => setOver(null)}
      >
        {dockItems.map(({ name, Icon }, i) => (
          <button
            key={name}
            style={{
              "--scale":
                over === i
                  ? 1.23
                  : over !== null && Math.abs(over - i) === 1
                    ? 1.06
                    : 1,
            }}
            className={"dock-item dock-" + i}
            aria-label={name}
            aria-pressed={selected === i}
            onPointerEnter={() => setOver(i)}
            onFocus={() => setOver(i)}
            onBlur={() => setOver(null)}
            onClick={() => {
              setSelected(i);
              onSelect?.(name);
            }}
          >
            {React.createElement(Icon, { size: 26, strokeWidth: 1.8 })}
            {over === i && <span className="dock-tooltip">{name}</span>}
            {selected === i && <i />}
          </button>
        ))}
      </div>
      <span className="dock-selection" role="status">
        {selected !== null ? dockItems[selected].name + " selected" : ""}
      </span>
    </div>
  );
}

const messages = [
  "Changes saved",
  "Link copied",
  "Export complete",
  "Draft synced",
];
export function StackedToasts() {
  const [items, setItems] = useState([
    { id: 2, label: messages[0] },
    { id: 1, label: "Draft synced" },
    { id: 0, label: "Link copied" },
  ]);
  const id = useRef(2),
    [announcement, setAnnouncement] = useState("");
  function add() {
    id.current++;
    const item = {
      id: id.current,
      label: messages[(id.current - 2) % messages.length],
    };
    setItems((old) => [item, ...old].slice(0, 3));
    setAnnouncement(item.label + " · " + item.id);
  }
  function dismiss(id) {
    setItems((old) => old.filter((item) => item.id !== id));
    setAnnouncement("Notification dismissed");
  }
  return (
    <div className="toast-study">
      <div className="toast-pile">
        {items.map((item, i) => (
          <div
            className="notice"
            key={item.id}
            style={{ "--level": i, zIndex: 3 - i }}
            aria-hidden={i !== 0}
          >
            <span className="notice-check">
              <Check size={13} strokeWidth={3} />
            </span>
            <strong>{item.label}</strong>
            <button
              aria-label={"Dismiss " + item.label}
              tabIndex={i === 0 ? 0 : -1}
              disabled={i !== 0}
              onClick={() => dismiss(item.id)}
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {!items.length && <span className="empty-pile">All caught up</span>}
      </div>
      <button className="add-toast" onClick={add}>
        <Plus size={12} /> Add toast
      </button>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

export function ElasticSlider({ initialValue = 68, onChange }) {
  const [value, setValue] = useState(clamp(initialValue));
  return (
    <div className="range-study">
      <div className="range-label">
        <span>VOLUME</span>
        <output>{value}%</output>
      </div>
      <label className="range-control">
        <span className="range-bars" aria-hidden="true">
          {Array.from({ length: 34 }, (_, i) => (
            <i
              key={i}
              style={{
                height:
                  14 +
                  22 *
                    (0.5 + 0.5 * Math.sin(i * 0.65)) *
                    Math.sin(((i + 1) / 36) * Math.PI) +
                  "px",
                background: i / 34 < value / 100 ? "#273a4b" : "#c2d1db",
              }}
            />
          ))}
        </span>
        <input
          aria-label="Volume"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => {
            setValue(+e.target.value);
            onChange?.(+e.target.value);
          }}
        />
      </label>
    </div>
  );
}

export function HoldToConfirm({ onConfirm }) {
  const [state, setState] = useState("idle"),
    timer = useRef(null),
    reset = useRef(null);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(reset.current);
    },
    [],
  );
  function start() {
    if (timer.current || state === "done") return;
    setState("holding");
    timer.current = setTimeout(() => {
      timer.current = null;
      setState("done");
      onConfirm?.();
      reset.current = setTimeout(() => setState("idle"), 1800);
    }, 850);
  }
  function stop() {
    clearTimeout(timer.current);
    timer.current = null;
    setState((v) => (v === "holding" ? "idle" : v));
  }
  return (
    <button
      className={"hold-control " + state}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onLostPointerCapture={stop}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if (!e.repeat && [" ", "Enter"].includes(e.key)) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if ([" ", "Enter"].includes(e.key)) {
          e.preventDefault();
          stop();
        }
      }}
      onBlur={stop}
    >
      <span className="hold-fill" />
      <span aria-live="polite">
        {state === "done" ? (
          <CheckCheck size={20} />
        ) : (
          <Fingerprint size={20} />
        )}{" "}
        {state === "done" ? "Confirmed" : "Hold to confirm"}
      </span>
    </button>
  );
}

const modes = [
  { name: "Board", Icon: PanelsTopLeft },
  { name: "List", Icon: List },
  { name: "Stack", Icon: Layers },
];
export function SegmentedControl({ onChange }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="segment-control" role="group" aria-label="View mode">
      <i style={{ transform: "translateX(" + selected * 100 + "%)" }} />
      {modes.map(({ name, Icon }, i) => (
        <button
          key={name}
          aria-pressed={selected === i}
          aria-label={name + " view"}
          onClick={() => {
            setSelected(i);
            onChange?.(name);
          }}
        >
          {React.createElement(Icon, { size: 17 })}
          {selected === i && <span>{name}</span>}
        </button>
      ))}
    </div>
  );
}
