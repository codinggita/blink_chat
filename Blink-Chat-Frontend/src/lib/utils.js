// Import clsx for merging multiple class names
import { clsx } from "clsx"; 

// Import twMerge to handle Tailwind class conflicts
import { twMerge } from "tailwind-merge"; 

// Utility function to merge class names dynamically
export function cn(...inputs) {
    // Merge class names while resolving Tailwind conflicts
    return twMerge(clsx(inputs)); 
}

// Array of predefined color styles with background, text, and border properties
export const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
    "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
    "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
];

// Function to get a color based on an index
export const getColor = (color) => {
    // Ensure the provided index is within the valid range
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    // Default to the first color if the index is out of range
    return colors[0]; 
};
