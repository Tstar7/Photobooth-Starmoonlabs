import { useState, useEffect } from 'react';
import type {
  BoothStep,
  CapturedPhoto,
  FilterOption,
  SessionMode,
  StickerItem,
  TemplateType,
  ThemeOption,
} from './types/photobooth';
import { FILTERS, THEMES } from './utils/constants';
import { useCamera } from './hooks/useCamera';
import { Navbar } from './components/Navbar';
import { PoseGuideModal } from './components/PoseGuideModal';
import { SetupStep } from './components/SetupStep';
import { CaptureStep } from './components/CaptureStep';
import { ReviewStep } from './components/ReviewStep';
import { CustomizeStep } from './components/CustomizeStep';
import { ExportStep } from './components/ExportStep';

export function App() {
  // Navigation / Workflow Step
  const [currentStep, setCurrentStep] = useState<BoothStep>('setup');

  // Session Settings
  const [sessionMode, setSessionMode] = useState<SessionMode>('solo');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(FILTERS[0]);

  // Captured Photos (Array of 4)
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [singleRetakeIndex, setSingleRetakeIndex] = useState<number | null>(null);

  // Customization Options
  const [template, setTemplate] = useState<TemplateType>('strip-4x1');
  const [theme, setTheme] = useState<ThemeOption>(THEMES[1]); // Default to Haru Film Biru
  const [customFrameColor, setCustomFrameColor] = useState<string>(THEMES[1].frameColor);
  const [caption, setCaption] = useState<string>('Kenangan Hari Ini 💖');
  const [showDate, setShowDate] = useState<boolean>(true);
  
  // Format current date e.g. "2026.10.28"
  const getFormattedDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  const [dateText, setDateText] = useState<string>(getFormattedDate());
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [stickers, setStickers] = useState<StickerItem[]>([]);

  // Posing Guide Modal
  const [isPoseGuideOpen, setIsPoseGuideOpen] = useState<boolean>(false);

  // Camera Management Hook
  const {
    videoRef,
    devices,
    selectedDeviceId,
    isStreaming,
    isLoading,
    error,
    isMirrored,
    isDemoMode,
    startCamera,
    switchDevice,
    toggleMirror,
    startDemoMode,
    capturePhoto,
  } = useCamera();

  // Try to start camera on initial mount or when entering setup
  useEffect(() => {
    if (currentStep === 'setup' && !isStreaming && !isDemoMode && !isLoading) {
      startCamera();
    }
  }, [currentStep, isStreaming, isDemoMode, isLoading, startCamera]);

  // Start 4-Photo Session
  const handleStartSession = () => {
    setPhotos([]);
    setSingleRetakeIndex(null);
    setCurrentStep('capture');
  };

  // Completed all 4 photos
  const handleFinishCaptureSession = (captured: CapturedPhoto[]) => {
    setPhotos(captured);
    setCurrentStep('review');
  };

  // Retake a single photo
  const handleRetakeSingle = (index: number) => {
    setSingleRetakeIndex(index);
    setCurrentStep('capture');
  };

  // Completed single photo retake
  const handleFinishSingleRetake = (newPhoto: CapturedPhoto) => {
    if (singleRetakeIndex !== null) {
      const updated = [...photos];
      updated[singleRetakeIndex] = newPhoto;
      setPhotos(updated);
    }
    setSingleRetakeIndex(null);
    setCurrentStep('review');
  };

  // Swap two photos in review
  const handleSwapPhotos = (index1: number, index2: number) => {
    const next = [...photos];
    const temp = next[index1];
    next[index1] = next[index2];
    next[index2] = temp;
    setPhotos(next);
  };

  // Retake all photos
  const handleRetakeAll = () => {
    setPhotos([]);
    setSingleRetakeIndex(null);
    setCurrentStep('capture');
  };

  // Reset entire session
  const handleResetSession = () => {
    if (photos.length > 0) {
      const confirmReset = window.confirm('Apakah kamu yakin ingin mengulang dan memulai sesi foto baru?');
      if (!confirmReset) return;
    }
    setPhotos([]);
    setSingleRetakeIndex(null);
    setStickers([]);
    setCurrentStep('setup');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 flex flex-col font-sans selection:bg-pink-200">
      {/* Top Korean Booth Navigation Bar */}
      <Navbar
        currentStep={currentStep}
        onReset={handleResetSession}
        onOpenPoseGuide={() => setIsPoseGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Step 1: Setup & Camera Permissions */}
        {currentStep === 'setup' && (
          <SetupStep
            sessionMode={sessionMode}
            onSetSessionMode={setSessionMode}
            countdownSeconds={countdownSeconds}
            onSetCountdownSeconds={setCountdownSeconds}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            isStreaming={isStreaming}
            isLoading={isLoading}
            error={error}
            isMirrored={isMirrored}
            isDemoMode={isDemoMode}
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onStartCamera={() => startCamera()}
            onStartDemoMode={startDemoMode}
            onSwitchDevice={switchDevice}
            onToggleMirror={toggleMirror}
            onStartSession={handleStartSession}
            videoRef={videoRef}
          />
        )}

        {/* Step 2: 4-Photo Live Shutter Capture */}
        {currentStep === 'capture' && (
          <CaptureStep
            sessionMode={sessionMode}
            countdownSeconds={countdownSeconds}
            selectedFilter={selectedFilter}
            isMirrored={isMirrored}
            isDemoMode={isDemoMode}
            videoRef={videoRef}
            onCapturePhoto={capturePhoto}
            onFinishSession={handleFinishCaptureSession}
            onCancel={() => {
              if (singleRetakeIndex !== null) {
                setSingleRetakeIndex(null);
                setCurrentStep('review');
              } else {
                setCurrentStep('setup');
              }
            }}
            singleRetakeIndex={singleRetakeIndex}
            onFinishSingleRetake={handleFinishSingleRetake}
          />
        )}

        {/* Step 3: Review Shots & Individual Retakes */}
        {currentStep === 'review' && (
          <ReviewStep
            photos={photos}
            onRetakeSingle={handleRetakeSingle}
            onRetakeAll={handleRetakeAll}
            onProceedToCustomize={() => setCurrentStep('customize')}
            onSwapPhotos={handleSwapPhotos}
          />
        )}

        {/* Step 4: Customize Strip Layout, Themes & Stickers */}
        {currentStep === 'customize' && (
          <CustomizeStep
            photos={photos}
            template={template}
            onSetTemplate={setTemplate}
            theme={theme}
            onSetTheme={setTheme}
            customFrameColor={customFrameColor}
            onSetCustomFrameColor={setCustomFrameColor}
            filter={selectedFilter}
            onSetFilter={setSelectedFilter}
            caption={caption}
            onSetCaption={setCaption}
            showDate={showDate}
            onSetShowDate={setShowDate}
            dateText={dateText}
            onSetDateText={setDateText}
            showBarcode={showBarcode}
            onSetShowBarcode={setShowBarcode}
            stickers={stickers}
            onSetStickers={setStickers}
            onBackToReview={() => setCurrentStep('review')}
            onProceedToExport={() => setCurrentStep('export')}
          />
        )}

        {/* Step 5: Export, High-Res Download & Sharing */}
        {currentStep === 'export' && (
          <ExportStep
            photos={photos}
            template={template}
            theme={theme}
            customFrameColor={customFrameColor}
            filter={selectedFilter}
            caption={caption}
            showDate={showDate}
            dateText={dateText}
            showBarcode={showBarcode}
            stickers={stickers}
            onStartNewSession={handleResetSession}
            onBackToCustomize={() => setCurrentStep('customize')}
          />
        )}
      </main>

      {/* Korean Posing Tips Modal */}
      <PoseGuideModal
        isOpen={isPoseGuideOpen}
        onClose={() => setIsPoseGuideOpen(false)}
      />

      {/* Footer Branding */}
      <footer className="py-4 border-t border-pink-100/60 text-center text-xs text-stone-500 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Photobooth Indonesia • KOREAN AESTHETIC STUDIO 📸</span>
          <span className="text-[11px] text-stone-400">Siap Cetak & Unduh Langsung</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
