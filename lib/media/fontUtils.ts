// Font utility functions

import { FontFile } from './types';

/**
 * Create mock font data for testing
 */
export const createMockFontData = (): FontFile[] => {
    return [
        {
            id: '1',
            filename: 'studio-64-brand.otf',
            title: 'Studio 64 Brand',
            description: 'Custom brand font for Studio 64',
            fileType: 'font',
            fileSize: 245760, // 240KB
            fileUrl:
                'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-01-15'),
            uploadedBy: 'admin',
            format: 'otf',
            fontFamily: 'Studio64Brand',
            fontWeight: '400',
            fontStyle: 'normal',
        },
        {
            id: '2',
            filename: 'creative-sans.ttf',
            title: 'Creative Sans',
            description: 'Modern sans-serif for creative projects',
            fileType: 'font',
            fileSize: 156672, // 153KB
            fileUrl:
                'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVIGxA.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-01-20'),
            uploadedBy: 'admin',
            format: 'ttf',
            fontFamily: 'CreativeSans',
            fontWeight: '300',
            fontStyle: 'normal',
        },
        {
            id: '3',
            filename: 'bold-display.woff2',
            title: 'Bold Display',
            description: 'Heavy display font for headlines',
            fileType: 'font',
            fileSize: 32768, // 32KB
            fileUrl:
                'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-01-25'),
            uploadedBy: 'admin',
            format: 'woff2',
            fontFamily: 'BoldDisplay',
            fontWeight: '700',
            fontStyle: 'normal',
        },
        {
            id: '4',
            filename: 'elegant-serif.woff',
            title: 'Elegant Serif',
            description: 'Classic serif font for body text',
            fileType: 'font',
            fileSize: 65536, // 64KB
            fileUrl:
                'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDYbtXK-F2qO0s.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-02-01'),
            uploadedBy: 'admin',
            format: 'woff',
            fontFamily: 'ElegantSerif',
            fontWeight: '400',
            fontStyle: 'normal',
        },
        {
            id: '5',
            filename: 'italic-script.otf',
            title: 'Italic Script',
            description: 'Elegant script font for special occasions',
            fileType: 'font',
            fileSize: 98304, // 96KB
            fileUrl:
                'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-02-05'),
            uploadedBy: 'admin',
            format: 'otf',
            fontFamily: 'ItalicScript',
            fontWeight: '400',
            fontStyle: 'italic',
        },
        {
            id: '6',
            filename: 'monospace-code.ttf',
            title: 'Monospace Code',
            description: 'Monospace font for code and technical content',
            fileType: 'font',
            fileSize: 131072, // 128KB
            fileUrl:
                'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_SiYsKILxRpg3hIP6sJ7fM7PqlPevWnsUnxG.woff2',
            folderId: 'fonts',
            uploadedAt: new Date('2024-02-10'),
            uploadedBy: 'admin',
            format: 'ttf',
            fontFamily: 'MonospaceCode',
            fontWeight: '400',
            fontStyle: 'normal',
        },
    ];
};

/**
 * Check if file type is a supported font format
 */
export const isSupportedFontFormat = (filename: string): boolean => {
    const supportedFormats = ['.ttf', '.otf', '.woff', '.woff2'];
    const extension = filename
        .toLowerCase()
        .substring(filename.lastIndexOf('.'));
    return supportedFormats.includes(extension);
};

/**
 * Get font format icon
 */
export const getFontFormatIcon = (format: string): string => {
    switch (format.toLowerCase()) {
        case 'ttf':
            return '🔤';
        case 'otf':
            return '🔤';
        case 'woff':
            return '🔤';
        case 'woff2':
            return '🔤';
        default:
            return '📝';
    }
};

/**
 * Generate font preview text based on font style
 */
export const getFontPreviewText = (font: FontFile): string => {
    const baseText = 'The quick brown fox jumps over the lazy dog';

    switch (font.fontFamily.toLowerCase()) {
        case 'bolddisplay':
            return 'BOLD HEADLINES';
        case 'italicscript':
            return 'Elegant Script';
        case 'monospacecode':
            return 'console.log("Hello World");';
        case 'elegantserif':
            return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        default:
            return baseText;
    }
};

/**
 * Get font weight display name
 */
export const getFontWeightName = (weight: string): string => {
    switch (weight) {
        case '100':
            return 'Thin';
        case '200':
            return 'Extra Light';
        case '300':
            return 'Light';
        case '400':
            return 'Regular';
        case '500':
            return 'Medium';
        case '600':
            return 'Semi Bold';
        case '700':
            return 'Bold';
        case '800':
            return 'Extra Bold';
        case '900':
            return 'Black';
        default:
            return weight;
    }
};

/**
 * Load font dynamically
 */
export const loadFont = (font: FontFile): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fontFace = new FontFace(font.fontFamily, `url(${font.fileUrl})`, {
            weight: font.fontWeight,
            style: font.fontStyle,
        });

        fontFace
            .load()
            .then((loadedFont) => {
                document.fonts.add(loadedFont);
                resolve();
            })
            .catch((error) => {
                console.error('Failed to load font:', error);
                reject(error);
            });
    });
};
