import React from "react";

function Rating({
    value = 0,
    onChange,
    readonly = false,
    size = "medium"
}) {
    const currentValue = Number(value) || 0;

    return (
        <div className={`rating rating-${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={
                        star <= currentValue
                            ? "rating-star active"
                            : "rating-star"
                    }
                    onClick={() => {
                        if (!readonly && onChange) {
                            onChange(star);
                        }
                    }}
                    disabled={readonly}
                    aria-label={`Rate ${star} out of 5`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default Rating;