import { Component, ConcreteComponent } from "vue";

export type ElementContent = string
    | { html: string }
    | {
    component: Component | ConcreteComponent;
    componentProps?: Record<string, any>;
};