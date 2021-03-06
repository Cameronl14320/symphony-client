import ICrosshair from "../../data/interfaces/ICrosshair";
import {crosshairColour, ICrosshairOutlines} from "../../data/interfaces/ICrosshairConfig";
import defaultCrosshair from "../../data/default-crosshair.json";

export const getOutlines = (outlinesConfig: ICrosshairOutlines) => {
    if (outlinesConfig.outlinesEnabled) {
        if (outlinesConfig.outline.outlineOpacity > 0 && outlinesConfig.outline.outlineThickness > 0) {
            return {
                border: `${ outlinesConfig.outline.outlineThickness }px solid rgba(0, 0, 0, ${ outlinesConfig.outline.outlineOpacity })`
            }
        }
    }
    return {};
}

export const hasNextAttribute = (root: string, context: string) => {
    if (!context.startsWith(root)) {
        return false;
    }

    const comparison = context.substring(root.length);
    return comparison.includes(";");
}

export const extractKeyValue = (key: string, config: string, isFloat: boolean = false): number | null => {
    const context = config.substring(config.indexOf(key));
    let findValue = "";
    if (hasNextAttribute(key, context)) {
        findValue = context.substring(key.length, key.length + context.substring(key.length).indexOf(";"));
    } else {
        findValue = context.substring(key.length);
    }
    return isFloat ? parseFloat(findValue) : parseInt(findValue);
}

export const importCrosshair = (config: string) => {
    let imported: ICrosshair = JSON.parse(JSON.stringify(defaultCrosshair));
    if (config === "0") {
        return imported;
    }
    // show outlines: h;0 - turn off [default = on]
    if (config.includes(";h;0")) {
        imported.config.outlines.outlinesEnabled = false;
    } else {
        // outline opacity: o;float
        if (config.includes(";o;")) {
            const outlineOpacity = extractKeyValue(";o;", config, true);
            imported.config.outlines.outline.outlineOpacity = outlineOpacity !== null ? outlineOpacity : imported.config.outlines.outline.outlineOpacity;
        }
        // outline thickness: t;int
        if (config.includes(";t;")) {
            const outlineThickness = extractKeyValue(";t;", config);
            imported.config.outlines.outline.outlineThickness = outlineThickness !== null ? outlineThickness : imported.config.outlines.outline.outlineThickness;
        }
    }

    // colour - default none
    if (config.includes(";c;")) {
        const colour = extractKeyValue(";c;", config);
        imported.config.colour = (!!colour ? crosshairColour[colour] : imported.config.colour) as crosshairColour;
    }

    // show center dot: d;1 - turn on [default = off]
    if (config.includes(";d;1")) {
        imported.config.centerDot.dotEnabled = true;
        // center dot opacity: a;float
        if (config.includes(";a;")) {
            const centerDotOpacity = extractKeyValue(";a;", config, true);
            imported.config.centerDot.dot.centerDotOpacity = centerDotOpacity !== null ? centerDotOpacity : imported.config.centerDot.dot.centerDotOpacity
        }
        // center dot thickness: z:int
        if (config.includes(";z;")) {
            const centerDotThickness = extractKeyValue(";z;", config);
            imported.config.centerDot.dot.centerDotThickness = centerDotThickness !== null ? centerDotThickness : imported.config.centerDot.dot.centerDotThickness
        }
    }

    // override firing error offset with crosshair offset: m;1 - turn on [default = off]
    if (config.includes(";m;1")) {
        imported.config.overrideOffset = true;
    }

    // show inner line: 0b;0 - turn off [default = on]
    if (config.includes(";0b;0")) {
        imported.config.innerLines.linesEnabled = false;
    } else {
        // inner line opacity: 0a;float
        if (config.includes(";0a;")) {
            const lineOpacity = extractKeyValue(";0a;", config, true);
            imported.config.innerLines.lines.lineOpacity = lineOpacity !== null ? lineOpacity : imported.config.innerLines.lines.lineOpacity
        }
        // inner line length: 0l;int
        if (config.includes(";0l;")) {
            const lineLength = extractKeyValue(";0l;", config);
            imported.config.innerLines.lines.lineLength = lineLength !== null ? lineLength : imported.config.innerLines.lines.lineLength
        }
        // inner line thickness: 0t;int
        if (config.includes(";0t;")) {
            const lineThickness = extractKeyValue(";0t;", config);
            imported.config.innerLines.lines.lineThickness = lineThickness !== null ? lineThickness : imported.config.innerLines.lines.lineThickness
        }
        // inner line offset: 0o;int
        if (config.includes(";0o;")) {
            const lineOffset = extractKeyValue(";0o;", config);
            console.log("line offset", lineOffset);
            imported.config.innerLines.lines.lineOffset = lineOffset !== null ? lineOffset : imported.config.innerLines.lines.lineOffset
        }

        // inner line movement error: 0m;1 - turn on [default = off]
        if (config.includes(";0m;1")) {
            // inner line movement error multiplier: 0s;float
            if (config.includes(";0s;")) {
                const movementError = extractKeyValue(";0s;", config, true);
                imported.config.innerLines.lines.movementError.multiplier = movementError !== null ? movementError : imported.config.innerLines.lines.movementError.multiplier
            }
        }

        // inner line firing error: 0f;0 - turn off [default = on]
        if (config.includes(";0f;0")) {
            imported.config.innerLines.lines.firingErrorEnabled = false;
        } else {
            // inner line firing error multiplier: 0e;float
            if (config.includes(";0e;")) {
                const firingError = extractKeyValue(";0e;", config, true);
                imported.config.innerLines.lines.firingError.multiplier = firingError !== null ? firingError : imported.config.innerLines.lines.firingError.multiplier
            }
        }
    }

    // show outer line: 1b;0 - turn off [default = on]
    if (config.includes(";1b;0")) {
        imported.config.outerLines.linesEnabled = false;
    } else {
        // outer line opacity: 1a;float
        if (config.includes(";1a;")) {
            const lineOpacity = extractKeyValue(";1a;", config, true);
            imported.config.outerLines.lines.lineOpacity = lineOpacity !== null ? lineOpacity : imported.config.outerLines.lines.lineOpacity

        }
        // outer line length: 1l;int
        if (config.includes(";1l;")) {
            const lineLength = extractKeyValue(";1l;", config, true);
            imported.config.outerLines.lines.lineLength = lineLength !== null ? lineLength : imported.config.outerLines.lines.lineLength
        }
        // outer line thickness: 1t;int
        if (config.includes(";1t;")) {
            const lineThickness = extractKeyValue(";1t;", config);
            imported.config.outerLines.lines.lineThickness = lineThickness !== null ? lineThickness : imported.config.outerLines.lines.lineThickness
        }
        // outer line offset: 1o;int
        if (config.includes(";1o;")) {
            const lineOffset = extractKeyValue(";1o;", config);
            imported.config.outerLines.lines.lineOffset = lineOffset !== null ? lineOffset : imported.config.outerLines.lines.lineOffset
        }

        // outer line movement error: 1m;0 - turn off [default = on]
        if (config.includes(";1m;0")) {
            imported.config.outerLines.lines.movementErrorEnabled = false;
        } else {
            // outer line movement error multipler: 1s;float
            if (config.includes(";1s;")) {
                const movementError = extractKeyValue(";1s;", config, true);
                imported.config.outerLines.lines.movementError.multiplier = movementError !== null ? movementError : imported.config.outerLines.lines.movementError.multiplier
            }
        }

        // outer line firing error: 1f;0 - turn off [default = on]
        if (config.includes(";1f;0")) {
            imported.config.outerLines.lines.firingErrorEnabled = false;
        } else {
            // outer line firing error multiplier: 1e:float
            if (config.includes(";1e")) {
                const firingError = extractKeyValue(";1e;", config, true);
                imported.config.outerLines.lines.firingError.multiplier = firingError !== null ? firingError : imported.config.outerLines.lines.firingError.multiplier
            }
        }
    }

    return imported
}
