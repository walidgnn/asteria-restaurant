import { Controller, Get, Param } from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("menu")
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async getMenu() {
    return this.menuService.getFullMenu();
  }

    @Get(":id")
  async getDish(@Param("id") id: string) {
    return this.menuService.getDishById(id);
  }
}