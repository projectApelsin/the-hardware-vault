import React, { useState, useEffect } from "react";

const RecommendationFilterComponent = ({ setBudget, setCategoryId, categories }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [budgetInput, setBudgetInput] = useState("");

    // Загружаем сохранённые фильтры при первом рендере
    useEffect(() => {
        const savedBudget = localStorage.getItem("budget");
        const savedCategory = localStorage.getItem("category");

        if (savedBudget) {
            setBudgetInput(savedBudget);
            setBudget(Number(savedBudget)); // Передаём в родительский компонент
        }

        if (savedCategory) {
            const category = categories.find(cat => cat.id === Number(savedCategory));
            if (category) {
                setSelectedCategory(category);
                setCategoryId(category.id); // Передаём в родительский компонент
            }
        }
    }, [categories, setBudget, setCategoryId]);

    const handleBudgetChange = (e) => {
        setBudgetInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            const budgetValue = Number(budgetInput);
            if (!isNaN(budgetValue) && budgetValue > 0) {
                setBudget(budgetValue);
                localStorage.setItem("budget", budgetValue); // Сохраняем в localStorage
            }
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCategoryId(category.id);
        localStorage.setItem("category", category.id); // Сохраняем в localStorage
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-5 ml-25 mr-25">
            <h1 className="font-montserrat font-semibold text-2xl">
                Введіть ваш бюджет та оберіть категорію, а ми порекомендуємо Вам товари:
            </h1>
            <div className="flex flex-row justify-between ml-15 mr-15 mt-2">
                <div className="flex flex-col">
                    <input
                        type="text"
                        value={budgetInput}
                        onChange={handleBudgetChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Введіть ваш бюджет"
                        className="h-10 w-100 rounded-md border-2 border-smalt-800 focus:border-smalt-800 focus:outline-none pl-4"
                    />
                </div>
                <div className="relative">
                    <div
                        className="bg-smalt-100 w-80 p-4 rounded-xl cursor-pointer mb-4"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <p className="font-montserrat font-medium ml-5">
                            {selectedCategory ? selectedCategory.title : "Оберіть категорію"}
                        </p>
                    </div>
                    {isOpen && (
                        <div className="bg-smalt-100 duration-300 flex-col rounded-xl h-auto flex gap-4 pt-5 pb-5 absolute z-50 w-80 cursor-pointer">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="ml-9 flex"
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    <p className="font-montserrat font-medium">{category.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationFilterComponent;
