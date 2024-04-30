import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import About from '@/views/About/index.vue'
import Project from '@/views/Project/index.vue'
import ProjectCreate from "@/views/Project/ProjectCreate.vue";
import Work from "@/views/Work/index.vue"
import Home from "@/views/Work/components/Home.vue"
import ProjectContent from "@/views/Work/components/projectContent.vue";
import Entity from "@/views/Work/components/entity.vue";
import Relation from "@/views/Work/components/relation.vue";
import User from "@/views/Work/components/user.vue";
import Statistics from "@/views/Work/components/statistics.vue";
import Setting from "@/views/Work/components/setting.vue";
import AddProjectContent from "@/views/WorkDetail/AddProjectContent.vue";
import LabelTask from "@/views/WorkDetail/LabelTask.vue";
import CreateLabel from "@/views/WorkDetail/CreateLabel.vue";
import UpdateLabel from "@/views/WorkDetail/UpdateLabel.vue";
import CreateUser from "@/views/WorkDetail/CreateUser.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:"/",
            component: About
        },
        {
            path:"/login",
            component: Login
        },
        {
            path:"/project",
            component: Project
        },
        {
            path:"/create/project",
            component: ProjectCreate
        },
        {
            name:"work",
            path:"/work/:projectId",
            component:Work,
            children:[
                {
                    path:"home",
                    component: Home,
                },
                {
                    path:"projectContent",
                    component: ProjectContent,
                },
                {
                    path:"createContent",
                    component:AddProjectContent
                },
                {
                    path:"entity",
                    component: Entity,
                },
                {
                    path:"relation",
                    component: Relation,
                },
                {
                    path:"user",
                    component: User,
                },
                {
                    path:"statistics",
                    component: Statistics,
                },
                {
                    path:"setting",
                    component: Setting,
                },
                {
                    name:"labelTask",
                    path:"labelTask/:contentId",
                    component:LabelTask
                },
                {
                    name:"createLabel",
                    path:"createLabel",
                    component:CreateLabel
                },
                {
                    name:"updateLabel",
                    path:"updateLabel",
                    component:UpdateLabel
                },
                {
                    name:"createUser",
                    path:"createUser",
                    component:CreateUser
                }
            ]
        }

    ]
})

export default router