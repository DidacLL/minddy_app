import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/20/solid";

interface DateSelectorProps {
    title: string;
    onChange: (val: Date) => void;
    initialValue?: Date;
}

export function DateSelector(props: DateSelectorProps) {
    const [selectedDate, setSelectedDate] = useState(props.initialValue );

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(event.target.value);
        setSelectedDate(newDate);
        props.onChange(newDate);
    };

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{props.title}</span>
            </label>
            <div className="relative">
                <input type="date"
                       value={selectedDate?.toISOString().substring(0, 10)||''}
                       onChange={handleDateChange}
                       className="w-full pr-10 input input-bordered" />
                {/*<CalendarIcon className="absolute top-0 right-0 m-2 w-5 h-5 text-gray-500 pointer-events-none" />*/}
            </div>
        </div>
    );
}
