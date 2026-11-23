import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/businessData';
import { getNextPhotoIndex, getPrevPhotoIndex } from '../utils/contact';

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      } else if (event.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : getNextPhotoIndex(prev, GALLERY_PHOTOS.length)
        );
      } else if (event.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : getPrevPhotoIndex(prev, GALLERY_PHOTOS.length)
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const activePhoto = selectedIndex !== null ? GALLERY_PHOTOS[selectedIndex] : null;

  return (
    <section id="galeria" aria-labelledby="heading-galeria" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#E63946] mb-2">
              Registros Reais do Nosso Trabalho
            </p>
            <h2
              id="heading-galeria"
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
            >
              Galeria de Fotos
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md">
            Conheça nossa estrutura no bairro Jundiaí e os bastidores dos atendimentos realizados em Anápolis. Clique em qualquer foto para ampliar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GALLERY_PHOTOS.map((photo, index) => {
            const hasFailed = Boolean(failedImages[photo.id]);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ampliar foto ${index + 1}: ${photo.title}`}
                className="group text-left rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-[#0B3D91] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E63946]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {!hasFailed ? (
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [photo.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
                      <ImageOff className="w-7 h-7 mb-2 text-[#0B3D91]" aria-hidden="true" />
                      <span className="text-xs font-medium">{photo.title}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/95 border border-slate-200 flex items-center justify-center text-[#0B3D91] opacity-90 group-hover:opacity-100">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-display text-sm font-bold text-[#0B3D91]">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessible Lightbox Dialog */}
      {activePhoto && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${activePhoto.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/88 p-4 sm:p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold text-[#E63946] tabular-nums">
                  Foto {selectedIndex + 1} de {GALLERY_PHOTOS.length}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0B3D91]">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Fechar visualização da foto"
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {!failedImages[activePhoto.id] ? (
                <img
                  src={activePhoto.url}
                  alt={activePhoto.alt}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
              ) : (
                <div className="py-24 px-8 text-center text-slate-300">
                  <ImageOff className="w-10 h-10 mx-auto mb-3 text-[#E63946]" aria-hidden="true" />
                  <p className="text-sm">{activePhoto.title}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(getPrevPhotoIndex(selectedIndex, GALLERY_PHOTOS.length))
                }
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/95 text-[#0B3D91] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(getNextPhotoIndex(selectedIndex, GALLERY_PHOTOS.length))
                }
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/95 text-[#0B3D91] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-4 bg-white border-t border-slate-200">
              <p className="text-sm text-slate-700">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
