import SvgIcon from "@/components/SvgIcon.vue";


const componentPlugin: any = {
  install: function (vue: any) {

    vue.component(SvgIcon.name, SvgIcon);
  }
};
export default componentPlugin;
