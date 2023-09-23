import {useEffect, useState} from "react";
import {themeChange} from "theme-change";
import {useThemeDetector} from "../../data/hooks/useThemeDetector";

export function ThemeSelector() {

    const systemTheme= useThemeDetector();
    const val= localStorage.getItem("theme") as string;
    const savedTheme:string=val?val:systemTheme?"dark":"light";
    const [selected, setSelected] = useState<string>(savedTheme);
    useEffect(() => {
        themeChange(false)
        //  false parameter is required for react project
    }, [])

    useEffect(() => {
        themeChange(true)
    }, [selected]);
    return <select data-choose-theme
                   value={selected}
                   onChange={(v) => setSelected(v.currentTarget.value)}
                    className="focus:outline-none select select-sm "
    >
        <option value="minddy_light">Minddy Light</option>
        <option value="minddy_dark">Minddy Dark</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="cupcake">Cupcake</option>
        <option value="dracula">Dracula</option>
        <option value="retro">Retro</option>
        <option value="bumblebee">BumbleBee</option>
        <option value="emerald">Emerald</option>
        <option value="corporate">Corporate</option>
        <option value="synthwave">Synth-wave</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="valentine">Valentine</option>
        <option value="halloween">Halloween</option>
        <option value="garden">Garden</option>
        <option value="forest">Forest</option>
        <option value="aqua">Aqua</option>
        <option value="lofi">LoFi</option>
        <option value="pastel">Pastel</option>
        <option value="fantasy">Fantasy</option>
        <option value="wireframe">Wireframe</option>
        <option value="black">Black</option>
        <option value="luxury">Luxury</option>
        <option value="dracula">Dracula</option>
        <option value="cmyk">CMYK</option>
        <option value="autumn">Autumn</option>
        <option value="business">Business</option>
        <option value="acid">Acid</option>
        <option value="lemonade">Lemonade</option>
        <option value="night">Night</option>
        <option value="cofee">Coffee</option>
        <option value="winter">Winter</option>
    </select>;
}