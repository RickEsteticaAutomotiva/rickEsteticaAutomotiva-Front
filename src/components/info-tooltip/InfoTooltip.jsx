import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';

const TOOLTIP_PADDING = 16;
const TOOLTIP_OFFSET = 8;
const MAX_TOOLTIP_WIDTH = 280;

const POSITION_ABOVE = 'translate(-50%, -100%)';
const POSITION_BELOW = 'translate(-50%, 0)';

const INITIAL_POSITION = { top: 0, left: 0, transform: POSITION_ABOVE };

function useTooltipPosition(isVisible, iconRef, tooltipRef) {
    const [position, setPosition] = useState(INITIAL_POSITION);
    const rafIdRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (!iconRef.current) return;

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

        rafIdRef.current = requestAnimationFrame(() => {
            const rect = iconRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let top = rect.top - TOOLTIP_OFFSET;
            let left = rect.left + rect.width / 2;
            let transform = POSITION_ABOVE;

            if (tooltipRef.current) {
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const tooltipWidth = Math.min(tooltipRect.width, MAX_TOOLTIP_WIDTH);

                if (left + tooltipWidth / 2 > viewportWidth - TOOLTIP_PADDING) {
                    left = viewportWidth - tooltipWidth / 2 - TOOLTIP_PADDING;
                }

                if (left - tooltipWidth / 2 < TOOLTIP_PADDING) {
                    left = tooltipWidth / 2 + TOOLTIP_PADDING;
                }

                if (top - tooltipRect.height < TOOLTIP_PADDING) {
                    top = rect.bottom + TOOLTIP_OFFSET;
                    transform = POSITION_BELOW;
                }
            }

            setPosition({ top, left, transform });
        });
    }, [iconRef, tooltipRef]);

    useEffect(() => {
        if (!isVisible) return;

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible, updatePosition]);

    return position;
}

function TooltipArrow({ isAbove }) {
    const className = isAbove
        ? 'absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800'
        : 'absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gray-800';

    return <span className={className} />;
}

TooltipArrow.propTypes = {
    isAbove: PropTypes.bool.isRequired,
};

export function InfoTooltip({ message }) {
    const [isVisible, setIsVisible] = useState(false);
    const iconRef = useRef(null);
    const tooltipRef = useRef(null);
    const position = useTooltipPosition(isVisible, iconRef, tooltipRef);

    const isAbove = position.transform === POSITION_ABOVE;

    const show = useCallback(() => setIsVisible(true), []);
    const hide = useCallback(() => setIsVisible(false), []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVisible((prev) => !prev);
        }
    }, []);

    return (
        <>
            <button
                ref={iconRef}
                type="button"
                className="inline-flex items-center ml-1.5 cursor-help border-0 bg-transparent p-0 outline-none"
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
                onKeyDown={handleKeyDown}
                aria-label="Informação adicional"
            >
                <i className="bi bi-info-circle text-gray-500 text-sm transition-colors duration-200 hover:text-gray-700" />
            </button>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: position.transform,
                    }}
                >
                    <div className="bg-gray-800 text-white py-2.5 px-3 rounded-md text-[0.813rem] leading-snug shadow-lg max-w-[280px] text-left whitespace-pre-line">
                        <span className="block text-[0.7rem] uppercase tracking-[0.18em] text-gray-300 mb-1">Detalhes</span>
                        {message}
                        <TooltipArrow isAbove={isAbove} />
                    </div>
                </div>
            )}
        </>
    );
}

InfoTooltip.propTypes = {
    message: PropTypes.string.isRequired,
};
