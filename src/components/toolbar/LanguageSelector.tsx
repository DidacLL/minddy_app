import React, {useEffect, useRef, useState} from "react";

// export function LanguageSelector() {
//     const systemLang = navigator.language || 'en';
//     const savedLang = localStorage.getItem('lang') || systemLang;
//     const [selected, setSelected] = useState<string>(savedLang);
//
//     useEffect(() => {
//         localStorage.setItem('lang', selected);
//         document.documentElement.lang = selected;
//     }, [selected]);
//
//     return (
//         <select className={"focus:outline-none focus:bg"} value={selected} onChange={(v) => setSelected(v.currentTarget.value)}>
//             <option value="en">English</option>
//             <option value="es">Español</option>
//             <option value="fr">Català</option>
//         </select>
//     );
// }

export function LanguageSelector() {
    const systemLang: string = navigator.language || 'en';
    const savedLang: string = localStorage.getItem('lang') || systemLang;
    const [selected, setSelected] = useState<string>(savedLang);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {

        localStorage.setItem('lang', selected);
        document.documentElement.lang = selected;
    }, [selected]);

    const languages: string[] = ['en', 'es', 'cat']; // Add more languages as needed
        return (
        <select className="focus:outline-none select select-sm " value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Castellano</option>
            <option value="cat">Català</option>
        </select>
    );

}
// return (
//     <div ref={ref} className="relative">
//         <button onClick={() => setIsOpen(!isOpen)} className="btn">
//             {selected}
//         </button>
//         {isOpen && (
//             <ul className="absolute bg-base-200 shadow rounded mr-100 mt-2 py-1 w-full z-10 ">
//                 {languages.map((language: string) => (
//                     <li key={language}>
//                         <button onClick={() => setSelected(language)} className="block w-full text-left px-2 py-1 hover:bg-gray-200">
//                             {language}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         )}
//     </div>