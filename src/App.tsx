import React, { useState, useEffect } from "react";
import { Loader2, MousePointer2, ArrowRight, ShoppingCart, Download } from "lucide-react";
import { StylePreference, UserTasteDNA, SpatialAnalysisReport, DesignConcept, ProjectPlan, HeartRating, RoomType, RoomSegment } from "./shared/types/global";
import * as GeminiService from "./services/geminiService";
import { INTERIOR_IMAGES } from "./shared/constants/images";
import { AppHeader } from "./shared/components/AppHeader";
import { WizardNav } from "./shared/components/WizardNav";
import { LandingStep } from "./steps/LandingStep";
import { StylePreferencesStep } from "./steps/StylePreferencesStep";
import { UploadSpaceStep } from "./steps/UploadSpaceStep";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const TASTE_DNA_STORAGE_KEY = "ark_taste_dna_v5";

export default function App() {
  const [currentStep, setCurrentStep] = useState<string>("landing");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  const [discoveryIdx, setDiscoveryIdx] = useState(0);
  const [prefs, setPrefs] = useState<StylePreference[]>([]);
  const [tasteDNA, setTasteDNA] = useState<UserTasteDNA | null>(null);

  const [roomImg, setRoomImg] = useState<string | null>(null);
  const [confirmedRooms, setConfirmedRooms] = useState<RoomSegment[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<DesignConcept[]>([]);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);

  useEffect(() => {
    // Add dark background to body directly
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#EAE9E6";

    const saved = localStorage.getItem(TASTE_DNA_STORAGE_KEY);
    if (saved) {
      try {
        setTasteDNA(JSON.parse(saved));
        setCompletedSteps((prev) => [...prev, "style-preferences"]);
      } catch (e) {
        console.error(e);
      }
    }
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkApiKey();
  }, []);

  const markStepComplete = (id: string, nextStepId: string) => {
    setCompletedSteps((prev) => Array.from(new Set([...prev, id])));
    setCurrentStep(nextStepId);
  };

  const handleRating = async (rating: HeartRating) => {
    const current = INTERIOR_IMAGES[discoveryIdx];
    const newPrefs = [
      ...prefs,
      {
        styleId: current.id,
        styleName: current.label,
        imageType: "space" as any,
        rating,
      },
    ];
    setPrefs(newPrefs);
    if (newPrefs.length >= 10 || discoveryIdx >= INTERIOR_IMAGES.length - 1) {
      setLoading(true);
      setLoadingMsg("Synthesizing Style DNA...");
      try {
        if (!hasApiKey) {
          // @ts-ignore
          await window.aistudio?.openSelectKey?.();
          setHasApiKey(true);
        }
        const dna = await GeminiService.generateTasteDNA(newPrefs);
        setTasteDNA(dna);
        localStorage.setItem(TASTE_DNA_STORAGE_KEY, JSON.stringify(dna));
        markStepComplete("style-preferences", "upload-space");
      } catch (e) {
        alert("Taste Analysis Engine offline.");
      } finally {
        setLoading(false);
      }
    } else {
      setDiscoveryIdx((prev) => prev + 1);
    }
  };

  const analyzeSpace = async () => {
    if (!roomImg) return;
    setLoading(true);
    setLoadingMsg("Running Vision Spatial Detection...");
    try {
      const mimeType = roomImg.split(";")[0].split(":")[1];
      const base64Data = roomImg.split(",")[1];
      const report = await GeminiService.analyzeSpace(base64Data, mimeType);
      setConfirmedRooms(report.roomSegments || []);
      markStepComplete("upload-space", "edit-plan");
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        await window.aistudio.openSelectKey();
      } else {
        alert("Vision analysis failed. Ensure image is clear.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = (id: string, updates: Partial<RoomSegment>) => {
    setConfirmedRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  };

  const handleProceedToDesign = async () => {
    if (!tasteDNA || confirmedRooms.length === 0) return;
    setLoading(true);
    setLoadingMsg("Architecting Isometric Design Variations...");
    try {
      const res = await GeminiService.generateDesignConcepts(
        tasteDNA,
        confirmedRooms,
      );
      const withRenders = await Promise.all(
        res.map(async (c) => {
          const render = await GeminiService.generateIsometricRender(
            c,
            confirmedRooms,
          );
          return { ...c, isometricImages: { styled_0: render } };
        }),
      );
      setConcepts(withRenders);
      markStepComplete("edit-plan", "design-alternatives");
    } catch (e) {
      alert("Design generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectConcept = async (concept: DesignConcept) => {
    setLoading(true);
    setLoadingMsg("Compiling Phase-Based Implementation...");
    try {
      const p = await GeminiService.generateProjectPlan(
        concept,
        confirmedRooms,
      );
      setPlan(p);
      markStepComplete("design-alternatives", "materials-costs");
    } catch (e) {
      alert("Planning logic failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = confirmedRooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col font-sans text-foreground">
      {currentStep !== "landing" && <AppHeader />}
      {currentStep !== "landing" && <WizardNav currentStep={currentStep} completedSteps={completedSteps} setCurrentStep={setCurrentStep} />}

      <main className="flex-1 w-full flex flex-col p-6 sm:p-8">
        {loading && (
          <div className="fixed inset-0 bg-[#121110]/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-12 h-12 text-[#4F857D] mb-4" />
            <p className="text-lg font-medium text-[#EAE9E6] animate-pulse">
              {loadingMsg}
            </p>
          </div>
        )}

        {currentStep === "landing" && (
          <LandingStep
            hasApiKey={hasApiKey}
            setHasApiKey={setHasApiKey}
            tasteDNA={tasteDNA}
            setCurrentStep={setCurrentStep}
          />
        )}

        {currentStep === "style-preferences" && (
          <StylePreferencesStep
            discoveryIdx={discoveryIdx}
            prefs={prefs}
            handleRating={handleRating}
          />
        )}

        {currentStep === "upload-space" && (
          <UploadSpaceStep
            tasteDNA={tasteDNA}
            roomImg={roomImg}
            setRoomImg={setRoomImg}
            loading={loading}
            analyzeSpace={analyzeSpace}
          />
        )}

        {currentStep === "edit-plan" && (
          <div className="space-y-8 animate-fade-in-up max-w-[1200px] mx-auto w-full">
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-display text-4xl font-bold">
                Review Space Metrics
              </h2>
              <p className="text-[#91908C] text-lg">
                Click on rooms to edit details before rendering.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#1B1A19] border border-[#2A2927] rounded-xl p-8 relative overflow-hidden flex items-center justify-center min-h-[500px]">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full max-h-[600px]"
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <line
                        x1={i * 10}
                        y1="0"
                        x2={i * 10}
                        y2="100"
                        stroke="#3A3937"
                        strokeWidth="0.1"
                      />
                      <line
                        x1="0"
                        y1={i * 10}
                        x2="100"
                        y2={i * 10}
                        stroke="#3A3937"
                        strokeWidth="0.1"
                      />
                    </React.Fragment>
                  ))}
                  {(confirmedRooms || []).map((r) => {
                    const isSelected = selectedRoomId === r.id;
                    return (
                      <g
                        key={r.id}
                        onClick={() => setSelectedRoomId(r.id)}
                        className="cursor-pointer group"
                      >
                        <rect
                          x={r.bounds?.x}
                          y={r.bounds?.y}
                          width={r.bounds?.w}
                          height={r.bounds?.h}
                          fill={isSelected ? "#4F857D" : "#2A2927"}
                          fillOpacity={isSelected ? 0.3 : 0.8}
                          stroke={isSelected ? "#4F857D" : "#4A4946"}
                          strokeWidth={isSelected ? 0.6 : 0.3}
                          className="transition-all duration-200"
                          rx="1"
                        />
                        <text
                          x={r.bounds?.x + r.bounds?.w / 2}
                          y={r.bounds?.y + r.bounds?.h / 2 - 1}
                          fontSize="3"
                          fontWeight="600"
                          textAnchor="middle"
                          fill="#EAE9E6"
                          className="pointer-events-none font-sans transition-colors drop-shadow-md"
                        >
                          {r.type}
                        </text>
                        <text
                          x={r.bounds?.x + r.bounds?.w / 2}
                          y={r.bounds?.y + r.bounds?.h / 2 + 3}
                          fontSize="1.8"
                          fontWeight="500"
                          textAnchor="middle"
                          fill="#91908C"
                          className="pointer-events-none drop-shadow-md"
                        >
                          {r.dimensions?.width} × {r.dimensions?.length}m
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="space-y-6">
                {selectedRoom ? (
                  <div className="bg-[#262523] border border-[#3A3937] p-6 rounded-xl space-y-6 animate-fade-in shadow-lg">
                    <h3 className="font-display font-semibold text-2xl text-[#EAE9E6]">
                      Edit {selectedRoom.type}
                    </h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#91908C]">
                          Room Type
                        </label>
                        <select
                          value={selectedRoom.type}
                          onChange={(e) =>
                            updateRoom(selectedRoom.id, {
                              type: e.target.value as any,
                            })
                          }
                          className="w-full bg-[#121110] border border-[#3A3937] text-[#EAE9E6] rounded-md px-4 py-3 focus:outline-none focus:border-[#4F857D]"
                        >
                          {[
                            "Living Room",
                            "Bedroom",
                            "Kitchen",
                            "Bathroom",
                            "Dining Room",
                            "Entrance",
                            "Hallway",
                            "Balcony",
                            "Home Office",
                            "Storage",
                          ].map((rt) => (
                            <option key={rt} value={rt}>
                              {rt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#91908C]">
                            Width (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRoom.dimensions?.width ?? ''}
                            onChange={(e) =>
                              updateRoom(selectedRoom.id, {
                                dimensions: {
                                  width: parseFloat(e.target.value) || 0,
                                  length: selectedRoom.dimensions?.length || 0,
                                },
                              })
                            }
                            className="w-full bg-[#121110] border border-[#3A3937] text-[#EAE9E6] rounded-md px-4 py-3 focus:outline-none focus:border-[#4F857D]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#91908C]">
                            Length (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRoom.dimensions?.length ?? ''}
                            onChange={(e) =>
                              updateRoom(selectedRoom.id, {
                                dimensions: {
                                  width: selectedRoom.dimensions?.width || 0,
                                  length: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full bg-[#121110] border border-[#3A3937] text-[#EAE9E6] rounded-md px-4 py-3 focus:outline-none focus:border-[#4F857D]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#91908C]">
                          Ceiling Height (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={selectedRoom.ceilingHeight ?? ''}
                          onChange={(e) =>
                            updateRoom(selectedRoom.id, {
                              ceilingHeight: parseFloat(e.target.value) || 2.8,
                            })
                          }
                          className="w-full bg-[#121110] border border-[#3A3937] text-[#EAE9E6] rounded-md px-4 py-3 focus:outline-none focus:border-[#4F857D]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRoomId(null)}
                      className="w-full py-3 bg-[#3A3937] hover:bg-[#4A4946] text-[#EAE9E6] font-semibold rounded-md transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#1B1A19] border border-dashed border-[#3A3937] rounded-xl p-8 flex flex-col items-center justify-center text-center h-[350px] text-[#7A7975]">
                    <MousePointer2 className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium text-lg">
                      Select a room on the plan
                      <br />
                      to edit dimensions.
                    </p>
                  </div>
                )}

                <button
                  disabled={confirmedRooms.length === 0}
                  onClick={handleProceedToDesign}
                  className="w-full py-4 bg-[#2D4F4F] text-white font-semibold rounded-lg hover:bg-[#1D3F3F] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-md text-lg"
                >
                  Generate Concepts <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "design-alternatives" && (
          <div className="space-y-10 animate-fade-in-up max-w-[1200px] mx-auto w-full">
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-display text-4xl font-bold">
                Design Concepts
              </h2>
              <p className="text-[#91908C] text-lg">
                AI-rendered alternatives based on your floor plan and style DNA.
              </p>
            </div>

            <div className="grid xl:grid-cols-2 gap-8">
              {concepts.map((c, i) => (
                <div
                  key={i}
                  className="bg-[#262523] border border-[#3A3937] rounded-2xl overflow-hidden shadow-xl flex flex-col group"
                >
                  <div className="relative aspect-[4/3] bg-[#121110] overflow-hidden">
                    <img
                      src={c.isometricImages?.["styled_0"]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={c.title}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <button
                        onClick={() => selectConcept(c)}
                        className="w-full py-4 bg-[#EAE9E6] text-[#121110] font-bold text-lg rounded-xl shadow-2xl hover:bg-white transition-colors translate-y-6 group-hover:translate-y-0 duration-300"
                      >
                        Proceed with this Design
                      </button>
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div>
                      <h3 className="font-display text-3xl font-bold mb-3">
                        {c.title}
                      </h3>
                      <p className="text-[#91908C] leading-relaxed text-lg">
                        {c.rationale}
                      </p>
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div className="flex -space-x-3">
                        {(c.colorPalette || []).map((col, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 rounded-full border-2 border-[#262523] shadow-md"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                      <div className="text-sm border-t border-[#3A3937] pt-5">
                        <strong className="block mb-2 text-[#EAE9E6] text-base">
                          Furniture Strategy
                        </strong>
                        <span className="text-[#91908C] leading-relaxed">
                          {c.furnitureLayout}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "materials-costs" && plan && (
          <div className="space-y-12 animate-fade-in-up max-w-[1000px] mx-auto w-full pl-4 pr-4">
            <div className="text-center space-y-4 mb-10">
              <h2 className="font-display text-4xl font-bold">
                Materials & Costs
              </h2>
              <p className="text-[#91908C] text-lg max-w-2xl mx-auto">
                Analysis of all used materials in the chosen design alternative.
              </p>
            </div>

            <div className="bg-[#262523] border border-[#3A3937] rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1A1A1A] border-b border-[#3A3937]">
                      <th className="px-6 py-4 text-[#7A7975] font-bold text-sm uppercase tracking-wider">SN</th>
                      <th className="px-6 py-4 text-[#7A7975] font-bold text-sm uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[#7A7975] font-bold text-sm uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-[#7A7975] font-bold text-sm uppercase tracking-wider text-right">Est. Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A3937]">
                    {(plan.materials || []).map((mat, i) => (
                      <tr key={i} className="hover:bg-[#1E1E1E] transition-colors">
                        <td className="px-6 py-4 text-[#91908C] font-mono text-sm">{mat.id}</td>
                        <td className="px-6 py-4 text-[#EAE9E6] font-medium">{mat.name}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#121110] text-[#B3A687] px-2.5 py-1 rounded-md text-xs font-semibold border border-[#3A3937]">
                            {mat.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#4F857D] font-mono text-right font-semibold">
                          ${mat.estimatedPriceUSD?.toLocaleString() || "0"}
                        </td>
                      </tr>
                    ))}
                    {(!plan.materials || plan.materials.length === 0) && (
                       <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-[#91908C]">
                           No materials analysis available. Please regenerate the plan.
                         </td>
                       </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#1A1A1A] border-t border-[#3A3937]">
                      <td colSpan={3} className="px-6 py-4 text-[#7A7975] font-bold text-sm uppercase tracking-wider text-right">Total Estimated Cost:</td>
                      <td className="px-6 py-4 text-[#4F857D] font-mono font-bold text-right text-lg">{plan.totalBudget}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!completedSteps.includes("materials-costs")) {
                    setCompletedSteps((prev) => [...prev, "materials-costs"]);
                  }
                  setCurrentStep("implementation-plan");
                }}
                className="bg-[#2D4F4F] text-white hover:bg-[#1D3F3F] flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-colors shadow-sm text-lg"
              >
                Proceed to Implementation Plan <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === "implementation-plan" && plan && (
          <div className="space-y-12 animate-fade-in-up max-w-[1200px] mx-auto w-full pl-4 pr-4">
            <div className="text-center space-y-4 mb-10">
              <h2 className="font-display text-4xl font-bold">
                Implementation Plan
              </h2>
              <p className="text-[#91908C] text-lg max-w-2xl mx-auto">
                Step-by-step phases, estimated costs, and Gantt-style timetable to execute your design.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <div className="bg-[#262523] border border-[#3A3937] px-10 py-6 rounded-2xl shadow-lg flex flex-col items-center">
                  <span className="text-xs font-bold text-[#7A7975] uppercase tracking-widest block mb-1">
                    Timeline Duration
                  </span>
                  <span className="text-xl font-bold text-[#EAE9E6]">
                    {(plan.timeline?.phases || []).length * 2} - {(plan.timeline?.phases || []).length * 4} Weeks
                  </span>
                </div>
                <div className="bg-[#262523] border border-[#3A3937] px-10 py-6 rounded-2xl shadow-lg flex flex-col items-center">
                  <span className="text-xs font-bold text-[#7A7975] uppercase tracking-widest block mb-1">
                    Total Estimated Cost
                  </span>
                  <span className="text-3xl font-bold text-[#4F857D]">
                    {plan.totalBudget}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(plan.timeline?.phases || []).map((phase, pi) => (
                  <div
                    key={pi}
                    className="bg-[#262523] border border-[#3A3937] rounded-2xl p-8 flex flex-col shadow-lg"
                  >
                    <div className="flex justify-between items-start border-b border-[#3A3937] pb-5 mb-5">
                      <h4 className="font-display text-2xl font-bold max-w-[70%] leading-tight">
                        {phase.title}
                      </h4>
                      <span className="bg-[#121110] text-[#EAE9E6] px-3 py-1.5 rounded-lg text-sm font-bold border border-[#2A2927]">
                        {phase.estimatedCost}
                      </span>
                    </div>

                    <div className="space-y-4 flex-1 mt-2">
                      {(phase.tasks || []).map((t, ti) => {
                        return (
                          <div
                            key={ti}
                            className="flex gap-4 text-sm border-l-[3px] border-[#4A4946] pl-4 py-2 hover:border-[#4F857D] transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-[#EAE9E6] text-base mb-1">
                                {t.task}
                              </p>
                              <div className="flex justify-between items-center text-[#91908C]">
                                <span>
                                  {t.duration} • {t.type}
                                </span>
                                <span className="font-mono text-xs bg-[#121110] px-2 py-1 rounded text-[#EAE9E6]">
                                  {t.cost}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#262523] border border-[#3A3937] rounded-2xl overflow-hidden shadow-lg mt-12">
                <div className="bg-[#1B1A19] px-8 py-6 border-b border-[#3A3937] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4F857D]/10 text-[#4F857D] rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-2xl">
                      Shopping List
                    </h3>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#EAE9E6] text-[#121110] hover:bg-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
                  >
                    <Download className="w-5 h-5" /> Export PDF
                  </button>
                </div>
                <div className="p-8">
                  <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                    {(plan.timeline?.shoppingList || []).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base text-[#EAE9E6]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4F857D] shrink-0 mt-2" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
