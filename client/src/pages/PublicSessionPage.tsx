import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingIndicator from "../components/LoadingIndicator";
import useLiveSession from "../hooks/useLiveSession";
import LiveSection from "../components/livesession/LiveSection";

export default function PublicSessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    session,
    flatSections,
    currentIndex,
    setCurrentIndex,
    responses,
    loading,
    saveField,
    saveSection,
    uploadFile,
  } = useLiveSession(id!);

  // Redirect if sessie niet bestaat (na laden)
  useEffect(() => {
    if (!loading && !session) {
      navigate("/public");
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoadingIndicator />
      </div>
    );
  }

  const current = flatSections[currentIndex];
  const saved = responses[current.section.id] || {};

  const prev = async () => {
    await saveSection(current.section.id, saved);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };
  const next = async () => {
    await saveSection(current.section.id, saved);
    setCurrentIndex((i) =>
      Math.min(i + 1, flatSections.length - 1)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-xs flex flex-col"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 rounded-t-2xl p-4 flex flex-col items-center">
          <h2 className="text-xs text-white uppercase tracking-wide">
            {current.phase}
          </h2>
          <h1 className="text-lg font-semibold text-white mt-1 text-center">
            {current.section.naam}
          </h1>
        </div>

        {/* Inputs */}
        <LiveSection
          sessionId={id!}
          sectionData={current}
          saved={saved}
          onFieldSave={(compId, v) =>
            saveField(current.section.id, compId, v)
          }
          onSectionSave={(vals) =>
            saveSection(current.section.id, vals)
          }
          onUploadFile={(file, compId) =>
            uploadFile(current.section.id, compId, file)
          }
        />

        {/* Navigation */}
        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-b-2xl">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition ${
              currentIndex === 0
                ? "cursor-not-allowed opacity-50"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {currentIndex + 1} / {flatSections.length}
          </span>
          <button
            onClick={next}
            disabled={currentIndex === flatSections.length - 1}
            className={`p-2 rounded-full transition ${
              currentIndex === flatSections.length - 1
                ? "cursor-not-allowed opacity-50"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
