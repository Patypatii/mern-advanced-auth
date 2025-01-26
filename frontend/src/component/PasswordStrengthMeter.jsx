import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letters", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letters", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="mt-2 space-y-1">
            {criteria.map((item) => (
                <div key={item.label} className="flex items-center text-sm">
                    {item.met ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                        <X className="h-4 w-4 text-green-500 mr-2" />
                    )}
                    <span className={item.met ? "text-green-500" : "text-gray-400"}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrengthMeter = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[^A-Za-z\d]/.test(pass)) strength++;
        return strength;
    };

    const strength = getStrength(password);

    const getColor = (index, strength) => {
        if (index < strength) {
            if (strength === 1) return "bg-red-500";
            if (strength === 2) return "bg-yellow-500";
            if (strength >= 3) return "bg-green-500";
        }
        return "bg-gray-600";
    };

    const getStrengthText = (strength) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <div className="mt-2">
            {/* Password Strength Label */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Password Strength</span>
                <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
            </div>

            {/* Strength Indicator Bars */}
            <div className="flex space-x-1 mb-2">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${getColor(
                            index,
                            strength
                        )}`}
                    ></div>
                ))}
            </div>

            {/* Password Criteria */}
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrengthMeter;
