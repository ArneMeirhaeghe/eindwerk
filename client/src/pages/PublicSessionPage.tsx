// File: src/pages/PublicSessionPage.tsx

import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import TitlePreview from '../components/builder/previews/TitlePreview';
import SubheadingPreview from '../components/builder/previews/SubheadingPreview';
import ParagraphPreview from '../components/builder/previews/ParagraphPreview';
import QuotePreview from '../components/builder/previews/QuotePreview';
import ButtonPreview from '../components/builder/previews/ButtonPreview';
import ChecklistPreview from '../components/builder/previews/ChecklistPreview';
import CheckboxListPreview from '../components/builder/previews/CheckboxListPreview';
import DividerPreview from '../components/builder/previews/DividerPreview';
import ImagePreview from '../components/builder/previews/ImagePreview';
import VideoPreview from '../components/builder/previews/VideoPreview';
import FilePreview from '../components/builder/previews/FilePreview';
import GridPreview from '../components/builder/previews/GridPreview';
import type { LiveSessionDto } from '../api/verhuur/types';
import { getPublicSession } from '../api/verhuur';
import LoadingIndicator from '../components/LoadingIndicator';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const previewMap: Record<string, React.FC<{ p: any }>> = {
  title: TitlePreview,
  subheading: SubheadingPreview,
  paragraph: ParagraphPreview,
  quote: QuotePreview,
  button: ButtonPreview,
  checklist: ChecklistPreview,
  'checkbox-list': CheckboxListPreview,
  divider: DividerPreview,
  image: ImagePreview,
  video: VideoPreview,
  file: FilePreview,
  grid: GridPreview,
};

interface FlatSection {
  phase: string;
  section: {
    id: string;
    naam: string;
    components: {
      id: string;
      type: string;
      props: Record<string, any>;
    }[];
  };
}

export default function PublicSessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<LiveSessionDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [flatSections, setFlatSections] = useState<FlatSection[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch session or redirect if invalid
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        if (!id) {
          navigate('/public');
          return;
        }
        const data = await getPublicSession(id);
        setSession(data);
      } catch {
        navigate('/public');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, navigate]);

  // Once session is loaded, flatten phases → sections
  useEffect(() => {
    if (!session) return;
    const list: FlatSection[] = [];
    Object.entries(session.fases).forEach(
      ([phaseName, sections]) => {
        sections.forEach((sec) => {
          list.push({
            phase: phaseName,
            section: {
              id: sec.id,
              naam: sec.naam,
              components: sec.components.map((c) => ({
                id: c.id,
                type: c.type,
                props: c.props,
              })),
            },
          });
        });
      }
    );
    setFlatSections(list);
    setCurrentIndex(0);
  }, [session]);

  // Navigation handlers
  const prev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };
  const next = () => {
    setCurrentIndex((i) =>
      Math.min(i + 1, flatSections.length - 1)
    );
  };

  // Current flat section
  const current = useMemo(() => {
    if (flatSections.length === 0) return null;
    return flatSections[currentIndex];
  }, [flatSections, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoadingIndicator />
      </div>
    );
  }

  if (!session || !current) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Mobile container (max width ~420px) */}
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-xs flex flex-col"
        style={{ height: '90vh' }}
      >
        {/* Header: Phase & Section Name */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 rounded-t-2xl p-4 flex flex-col items-center">
          <h2 className="text-xs text-white uppercase tracking-wide">
            {current.phase}
          </h2>
          <h1 className="text-lg font-semibold text-white mt-1 text-center">
            {current.section.naam}
          </h1>
        </div>

        {/* Components Container */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {current.section.components.map((comp) => {
            const PreviewComponent =
              previewMap[comp.type];
            return (
              <div key={comp.id} className="mb-6 last:mb-0">
                {PreviewComponent && (
                  <PreviewComponent p={comp.props} />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: Navigation */}
        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-b-2xl">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition ${
              currentIndex === 0
                ? 'cursor-not-allowed opacity-50'
                : 'bg-white hover:bg-gray-200'
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
                ? 'cursor-not-allowed opacity-50'
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
