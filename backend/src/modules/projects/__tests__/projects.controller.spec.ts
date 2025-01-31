import { Test, TestingModule } from "@nestjs/testing";

import { ProjectsController } from "../projects.controller";

describe("ProjectController", () => {
  let service: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsController],
    }).compile();

    service = module.get<ProjectsController>(ProjectsController);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // TODO: Add more test cases for project controller methods
});
