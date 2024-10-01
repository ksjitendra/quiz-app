import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MODELS  } from '../../include.models';
 
@Module({
    imports: [
        SequelizeModule.forRoot({
            models: [...MODELS],
            dialect: 'sqlite',
            database:'quiz_db',
            storage: `./db.sqlite`,
            autoLoadModels: true,
            synchronize: true,
            // sync: { alter: true }
        })
    ],
    exports: [SequelizeModule]
})
export class DbModule implements OnModuleInit {
    // Use lifecycle hook to detect initialization
    onModuleInit() {
        console.log('DbModule has been initialized!');
    }
}
